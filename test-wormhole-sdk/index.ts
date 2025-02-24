import {
  amount,
  signSendWait,
  Wormhole,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import { getSigner } from "./helpers/helper";
// import solana from "@wormhole-foundation/sdk/solana";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const wh = await wormhole("Testnet", [evm], {
    chains: {
      BaseSepolia: {
        rpc:
          "https://base-sepolia.g.alchemy.com/v2/" +
          process.env.ALCHMEY_API_KEY,
      },
      Avalanche: {
        rpc:
          "https://avax-fuji.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
      Rootstock: {
        rpc:
          "https://rootstock-testnet.g.alchemy.com/v2/" +
          process.env.ALCHMEY_API_KEY,
      },
      ArbitrumSepolia: {
        rpc:
          "https://arb-sepolia.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
      Ethereum: {
        rpc:
          "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHMEY_API_KEY,
      },
    },
  });
  const ctx = wh.getChain("BaseSepolia");
  const rcv = wh.getChain("ArbitrumSepolia");
  const sender = await getSigner(ctx);
  const receiver = await getSigner(rcv);
  const sndTb = await ctx.getTokenBridge();
  const tokenId = Wormhole.tokenId(ctx.chain, "native");
  const amt = amount.units(
    amount.parse("0.01", ctx.config.nativeTokenDecimals)
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

  const vaa = await wh.getVaa(
    // Wormhole Message ID
    whm!,
    // Protocol:Payload name to use for decoding the VAA payload
    "TokenBridge:Transfer",
    // Timeout in milliseconds, depending on the chain and network, the VAA may take some time to be available
    60_000
  );

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

main();
