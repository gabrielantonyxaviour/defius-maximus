import {
  amount,
  signSendWait,
  Wormhole,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import { getSigner } from "./helpers/helper";
import dotenv from "dotenv";
dotenv.config();

async function bridgeNative(pkey: string, origin: string, assetAmount: string) {
  const wh = await wormhole("Testnet", [evm], {
    chains: {
      ArbitrumSepolia: {
        rpc:
          "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
      BaseSepolia: {
        rpc:
          "https://base-sepolia.g.alchemy.com/v2/" +
          process.env.ALCHMEY_API_KEY,
      },
      Avalanche: {
        rpc:
          "https://avax-fuji.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
      OptimismSepolia: {
        rpc:
          "https://opt-sepolia.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
    },
  });
  const ctx = wh.getChain(origin as any);
  const rcv = wh.getChain("ArbitrumSepolia");
  const sender = await getSigner(ctx);
  const receiver = await getSigner(rcv);
  const sndTb = await ctx.getTokenBridge();
  const tokenId = Wormhole.tokenId(ctx.chain, "native");
  const amt = amount.units(
    amount.parse(assetAmount, ctx.config.nativeTokenDecimals)
  );
  const transfer = sndTb.transfer(
    sender.address.address,
    receiver.address,
    tokenId.address,
    amt
  );
  const txids = await signSendWait(ctx, transfer, sender.signer);
  console.log("Sent: ", txids);

  const [whm] = await ctx.parseTransaction(txids[0].txid);
  console.log("Wormhole Messages: ", whm);

  console.log("Wait a while for finality...");
  let vaa;
  while (vaa == null) {
    vaa = await wh.getVaa(whm!, "TokenBridge:Transfer", 2000);
    console.log("VAA: ", vaa);
    console.log("wating for 2 mins");
    await new Promise((resolve) => setTimeout(resolve, 120000));
  }

  // Now get the token bridge on the redeem side
  const rcvTb = await rcv.getTokenBridge();

  // Create a transaction stream for redeeming
  const redeem = rcvTb.redeem(receiver.address.address, vaa!);

  // Sign and send the transaction
  const rcvTxids = await signSendWait(rcv, redeem, receiver.signer);
  console.log("Sent: ", rcvTxids);

  // Now check if the transfer is completed according to
  // the destination token bridge
  const finished = await rcvTb.isTransferCompleted(vaa!);
  console.log("Transfer completed: ", finished);
}

bridgeNative("", "OptimismSepolia", "0.01");
