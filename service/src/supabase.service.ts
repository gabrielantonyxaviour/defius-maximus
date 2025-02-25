import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { TradePlay } from "./types";

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
              analysis,
              asset,
              dex,
              chain,
              direction,
              research_description,
              entry_price,
              trade_type,
              expected_pnl,
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
              .eq("address", address)
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
              return;
            }

            // Fetch Balance.
            const rpcUrl = `https://arb-sepolia.g.alchemy.com/v2/${
              process.env.ALCHEMY_API_KEY || ""
            }`;
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
              console.error("Failed to fetch ETH Balance");
              return; // Modified to just return instead of using Response.json
            }
            console.log("\nBalanace of the user wallet on Arbitrum Sepolia\n");
            console.log(parseFloat(ethBalance).toFixed(4) + " ETH\n\n");
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
            let amount =
              (parseFloat(equitypercent) * parseFloat(ethBalance)) / 100;
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(user.pkey || "", provider);
            const exchangeRouter = new ethers.Contract(
              ARB_SEPOLIA_EXCHANGE_ROUTER,
              ARB_SEPOLIA_EXCHANGE_ROUTER_ABI,
              wallet
            );

            if (amount < 0.005) {
              console.log(
                "\n\nMinimum Amount required to place a trade is 0.005 ETH\n\n"
              );
              amount = 0.005;
            }
            const { hash } = await exchangeRouter.multicall(
              [
                exchangeRouter.interface.encodeFunctionData("sendWnt", [
                  ORDER_VAULT,
                  ethers.parseEther(amount.toString()),
                ]),
                exchangeRouter.interface.encodeFunctionData("createOrder", [
                  {
                    addresses: {
                      receiver: wallet.address, // Your address
                      callbackContract: ethers.ZeroAddress,
                      uiFeeReceiver: ethers.ZeroAddress,
                      market: MARKET_TOKEN,
                      initialCollateralToken: INITIAL_COLLATERAL_TOKEN, // USDC address
                      swapPath: [], // Empty array as no swaps needed
                    },
                    numbers: {
                      sizeDeltaUsd: "1000000000000000000000000000000",
                      initialCollateralDeltaAmount: "246368",
                      triggerPrice: 0,
                      acceptablePrice: "637806525538620321327636838",
                      executionFee: "495000000000000",
                      callbackGasLimit: 0,
                      minOutputAmount: 0,
                      validFromTime: 0,
                    },
                    orderType: 2, // Market order (executes immediately)
                    decreasePositionSwapType: 0,
                    isLong: true, // Long position
                    shouldUnwrapNativeToken: false,
                    referralCode:
                      "0x0000000000000000000000000000000000000000000000000000000000000000",
                  },
                ]),
              ],
              { value: ethers.parseEther(amount.toString()) }
            );

            console.log(
              "\n\nSuccessfully created a trade " +
                asset +
                "/USD futures position with " +
                amount +
                " ETH\n\n"
            );

            console.log(
              "\nTx hash:\nhttps://sepolia.arbiscan.io/tx/" + hash + "\n\n"
            );

            // Update supabase of the new executed trade
            const { data: _createTrade, error: createTradeError } =
              await this.supabase
                .from("executed_trades")
                .insert({
                  trade_play_id: id,
                  username: username,
                  amount: amount,
                  pnl_usdt: 0,
                  tx_hash: hash,
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
