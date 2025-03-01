import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { TradePlay } from "./types";
import { performSwap } from "./utils/sushiswap";
import { sushiTokenList } from "./utils/constants";
import { parseEther } from "viem";
import { placeTrade } from "./utils/gmx";
import getBalances from "./utils/balance";
import {
  arbitrumSepolia,
  avalancheFuji,
  base as baseChain,
  flowTestnet,
  zircuitTestnet,
} from "viem/chains";

export class SupabaseService {
  private static instance: SupabaseService;
  private supabase: SupabaseClient | null = null;
  private channel: any = null;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_KEY || "";

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.error("Supabase credentials not found in environment variables");
    }
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public async start(): Promise<void> {
    if (!this.supabase) return;
    try {
      console.log("[SupabaseService] Starting service...");
      this.channel = this.supabase
        .channel("trade_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "trade_plays",
          },
          async (payload) => {
            // Handle the new trade data
            const {
              id,
              chef_id,
              asset,
              direction,
              entry_price,
              leverage,
              trade_type,
              dex,
              chain,
              research_description,
              expected_pnl,
              analysis,
            } = payload.new as TradePlay;
            if (!analysis) return;
            console.log("\nRECEIVED NEW TRADE!!!\n\n");
            console.log("TRADE PLAY DETAILS");
            console.log("Chef ID: ", chef_id);
            console.log("Asset: ", asset);
            console.log("DEX: ", dex);
            console.log("Chain: ", chain == "both" ? "ARB or AVAX" : chain);
            console.log("Trade Direction: ", direction);
            console.log("Entry Price: ", entry_price);
            console.log("Leverage: ", leverage);
            console.log("Trade Type: ", trade_type);
            console.log("Expected PNL: ", expected_pnl);
            console.log("Research Description: ", research_description);
            console.log("\nAnalysis: \n", JSON.stringify(analysis, null, 2));
            console.log("\n\n");
            // Get profile from username.
            if (!this.supabase) return;
            const address = process.env.WALLET_ADDRESS || "";

            const { data: user, error } = await this.supabase
              .from("users")
              .select("*")
              .eq("id", address)
              .single();

            if (error) {
              console.error(`Error fetching user: ${error.message}`);
              return null;
            }
            console.log(
              `\nUser fetched successfully:\n ${JSON.stringify(user, null, 2)}`
            );

            const { data: isFollowing, error: isFollowingError } =
              await this.supabase
                .from("follows")
                .select("*")
                .eq("user_id", user?.id) // Assuming 'user_id' is the follower's ID
                .eq("chef_id", chef_id)
                .single(); // We expect one record if the user follows the chef

            if (isFollowingError) {
              console.error("Error checking follow status:", error);
            }

            if (user.mode == "BLUE PILL")
              console.log(
                "\n💊User is in BLUE PILL mode💊\nTrades are auto validated and assessed by AI \n"
              );
            if (user.mode == "RED PILL")
              console.log(
                "\n💪🏻User is in RED PILL mode💪🏻\nTrades are performed only if the user follows the chef with additional ai validation\n"
              );

            if (!isFollowing && user.mode == "RED PILL") {
              console.log(
                "\nUser is in RED PILL mode but not following the chef. Trade will not be executed\n"
              );
              console.log("By passing for the sake of demo");
            }

            // Verify if good score and can proceed with the trade.
            const {
              risktoreward,
              longtermscore,
              marketstrength,
              chefreputation,
              equitypercent,
              explanation,
            } = analysis;

            const shouldTrade =
              parseInt(risktoreward) > 15 &&
              parseInt(longtermscore) > 70 &&
              parseInt(marketstrength) > 50 &&
              parseInt(chefreputation) > 60 &&
              parseInt(equitypercent) > 5;

            console.log("\nExplanation:\n" + explanation);

            if (!shouldTrade) {
              console.log(
                "\n\nTrade analysis score is unfavourable. But performing to demo the flow...\n\n"
              );
            } else {
              console.log(
                "\nTrade anlaysis score is good, proceeding with the trade\n\n"
              );
            }

            let amount: number;
            let balances: Record<number, string> = {};
            if (dex.toLocaleLowerCase() == "gmx") {
              balances = await getBalances(user.address, [
                arbitrumSepolia,
                avalancheFuji,
              ]);
            } else if (dex.toLocaleLowerCase() == "sushi") {
              balances = await getBalances(user.address, [baseChain]);
            } else if (dex.toLocaleLowerCase() == "circuit") {
              balances = await getBalances(user.address, [zircuitTestnet]);
            } else if (dex.toLocaleLowerCase() == "kitty") {
              balances = await getBalances(user.address, [flowTestnet]);
            }

            if (trade_type == "perps") {
              console.log(user.address);
              const balance =
                chain == "avax"
                  ? balances[avalancheFuji.id]
                  : balances[arbitrumSepolia.id];
              // const minimumBalance = chain == "avax" ? 1 : 0.001;
              console.log(`\nBalanace of the user wallet on ${chain} \n`);
              console.log(parseFloat(balance).toFixed(4) + " ETH / AVAX\n\n");

              // !REMOVED BRIDGING FLOW FOR PERPS TRADES
              // if (parseFloat(balance) < minimumBalance) {
              //   console.log(
              //     `\nInsufficient funds on ${chain}  to perform the trade`
              //   );
              //   const nextChain = chain == "avax" ? "arb" : "avax";
              //   const nextChainBalance = chain == "avax" ? arb : avax;
              //   const nextChainMinimumBalance = nextChain == "avax" ? 1 : 0.001;
              //   console.log(
              //     `\Checking funds on ${nextChain} to bridge to ${chain}...`
              //   );
              //   if (parseFloat(nextChainBalance) < nextChainMinimumBalance) {
              //     console.log(
              //       `\nInsufficient funds on ${nextChain}  to perform the trade`
              //     );

              //     console.log(
              //       `\n Checking funds on base to bridge to ${chain}`
              //     );
              //     if (parseFloat(base) < 0.001) {
              //       console.log(
              //         `\nInsufficient funds on base to perform the trade`
              //       );
              //       return;
              //     } else {
              //       // Brigde base to ${chain}
              //     }
              //   } else {
              //     // Bridge ${nextChain} to ${chain}
              //   }
              // }
              if (chain == "avax") {
                if (parseFloat(balance) < 1) {
                  console.log(
                    `\nInsufficient funds on ${chain}  to perform the trade`
                  );

                  return;
                }
              } else {
                if (parseFloat(balance) < 0.001) {
                  console.log(
                    `\nInsufficient funds on ${chain}  to perform the trade`
                  );

                  return;
                }
              }

              // Get amount, constants and trade data prepared
              amount = (parseFloat(equitypercent) * parseFloat(balance)) / 100;

              if (chain == "arb" && amount < 0.004) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.004 ETH / AVAX \n\n"
                );
                amount = 0.004;
              }

              if (chain == "avax" && amount < 0.3) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 1 ETH / AVAX \n\n"
                );
                amount = 0.3;
              }

              amount = parseFloat(amount.toFixed(5));

              const tx = await placeTrade(
                "0x" + user.pkey,
                chain == "arb" ? "ETH" : "AVAX",
                asset,
                chain == "arb" ? "421614" : "43113",
                parseInt(leverage),
                amount,
                [],
                [],
                true
              );

              const { data: _createTrade, error: createTradeError } =
                await this.supabase
                  .from("executed_trades")
                  .insert({
                    trade_play_id: id,
                    user_id: user.id,
                    amount: amount,
                    pnl_usdt: 0,
                    tx_hash: tx,
                    status: "ongoing",
                  })
                  .select()
                  .single();

              if (createTradeError) {
                console.error(
                  `Error creating trade: ${createTradeError.message}`
                );
                return null;
              }

              console.log(`\n\nTrade created successfully!! ✅`);
            } else if (dex.toLocaleLowerCase() == "sushi") {
              const baseBalance = balances[baseChain.id];
              if (parseFloat(baseBalance) < 0.0001) {
                console.log("\nInsufficient funds to perform the trade");
                return;
              }

              amount =
                (parseFloat(equitypercent) * parseFloat(baseBalance)) / 100;

              if (amount < 0.00005) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.00005 ETH \n\n"
                );
                amount = 0.00005;
              }
              const tokenOut = sushiTokenList.find((t) => t.symbol == asset);
              if (tokenOut) {
                const tx = await performSwap({
                  pKey: "0x" + user.pkey,
                  tokenOut: tokenOut.address,
                  amount: parseEther(amount.toString()).toString(),
                });

                console.log("https://basescan.org/tx/" + tx);
                const { data: _createTrade, error: createTradeError } =
                  await this.supabase
                    .from("executed_trades")
                    .insert({
                      trade_play_id: id,
                      user_id: user.id,
                      amount: amount,
                      pnl_usdt: 0,
                      tx_hash: tx,
                      status: "ongoing",
                    })
                    .select()
                    .single();

                if (createTradeError) {
                  console.error(
                    `Error creating trade: ${createTradeError.message}`
                  );
                  return null;
                }

                console.log(`\n\nTrade created successfully!! ✅`);
              }
            } else if (dex.toLocaleLowerCase() == "circuit") {
              const ethBalance = balances[zircuitTestnet.id];
              if (parseFloat(ethBalance) < 0.0001) {
                console.log("\nInsufficient funds to perform the trade");
                return;
              }
              amount =
                (parseFloat(equitypercent) * parseFloat(ethBalance)) / 100;

              if (amount < 0.0001) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.00005 ETH \n\n"
                );
                amount = 0.0001;
              }
            } else {
              const flowBalance = balances[flowTestnet.id];
              if (parseFloat(flowBalance) < 0.01) {
                console.log("\nInsufficient funds to perform the trade");
                return;
              }
              amount =
                (parseFloat(equitypercent) * parseFloat(flowBalance)) / 100;

              if (amount < 0.01) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.00005 ETH \n\n"
                );
                amount = 0.01;
              }
            }
            return;
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });
    } catch (error) {
      console.error("[SupabaseService] Error:", error);
      throw new Error("Failed to initialize Supabase service");
    }
  }
}
