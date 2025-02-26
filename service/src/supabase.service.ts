import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { TradePlay } from "./types";
import { performSwap } from "./utils/sushiswap";
import { sushiTokenList } from "./utils/constants";
import { parseEther } from "viem";

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
            let amount;
            if (trade_type == "perps") {
              const rpcUrl =
                chain == "421614"
                  ? "https://arb-sepolia.g.alchemy.com/v2/" +
                    process.env.ALCHMEY_API_KEY
                  : "https://avax-fuji.g.alchemy.com/v2/" +
                    process.env.ALCHMEY_API_KEY;

              let ethBalance = "0";
              const ethResponse = await fetch(rpcUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  method: "eth_getBalance",
                  params: [user.address, "latest"],
                  id: 1,
                }),
              });

              const ethData: any = await ethResponse.json();
              if (ethData.result)
                ethBalance = (parseInt(ethData.result, 16) / 1e18).toString();
              else {
                console.error("Failed to fetch ETH / AVAX Balance");
                return; // Modified to just return instead of using Response.json
              }
              console.log(`\nBalanace of the user wallet on ${chain} \n`);
              console.log(
                parseFloat(ethBalance).toFixed(4) + " ETH / AVAX\n\n"
              );
              if (parseFloat(ethBalance) < 0.007) {
                console.log("\nInsufficient funds to perform the trade");
                return;
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

              // Get amount, constants and trade data prepared
              amount =
                (parseFloat(equitypercent) * parseFloat(ethBalance)) / 100;

              if (amount < 0.005) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.005 ETH / AVAX \n\n"
                );
                amount = 0.005;
              }
            } else {
              const rpcUrl =
                "https://rootstock-mainnet.g.alchemy.com/v2/" +
                process.env.ALCHMEY_API_KEY;
              let btcBalance = "0";
              const btcResponse = await fetch(rpcUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  method: "eth_getBalance",
                  params: [user.address, "latest"],
                  id: 1,
                }),
              });

              const btcData: any = await btcResponse.json();
              if (btcData.result)
                btcBalance = (parseInt(btcData.result, 16) / 1e18).toString();
              else {
                console.error("Failed to fetch STORY Balance");
                return; // Modified to just return instead of using Response.json
              }

              if (parseFloat(btcBalance) < 0.00001) {
                console.log("\nInsufficient funds to perform the trade");
                return;
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
              amount =
                (parseFloat(equitypercent) * parseFloat(btcBalance)) / 100;

              if (amount < 0.00005) {
                console.log(
                  "\n\nMinimum Amount required to place a trade is 0.00005 STORY \n\n"
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

                const { data: _createTrade, error: createTradeError } =
                  await this.supabase
                    .from("executed_trades")
                    .insert({
                      trade_play_id: id,
                      user_id: user.id,
                      amount: amount,
                      pnl_usdt: 0,
                      tx_hash: tx,
                      status: "open",
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
