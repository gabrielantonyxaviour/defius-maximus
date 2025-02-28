import { getRegistered, issueCreds } from "@/lib/humanity";
import { updateCredIdByUserId } from "@/lib/supabase";
import { Hex } from "viem";
export async function POST(request: Request) {
  const body = await request.json();
  const { ip, address, nft, royalty, score } = body;
  const credParams = {
    address: address as Hex,
    ip: ip as string,
    chef: nft as string,
    royalty: parseInt(royalty as string),
    chef_score: parseInt(score as string),
  };
  try {
    const credId = await issueCreds(credParams);
    if (credId) {
      console.log("Credential ID:", credId);
      console.log("Credential issued successfully");
      await updateCredIdByUserId(address, credId);
      return Response.json({
        credId,
      });
    } else {
      console.error("Failed to issue credential");
      return Response.json(
        {
          error: "Failed to issue credential",
        },
        {
          status: 500,
        }
      );
    }
  } catch (e) {
    return Response.json(
      {
        error: "Failed to issue credentials",
      },
      {
        status: 500,
      }
    );
  }
}
