import { ownsCreds } from "@/lib/humanity";
import { Hex } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const cred_id = searchParams.get("cred_id");

  try {
    const cred = await ownsCreds(address as Hex, cred_id as string);
    if (!cred) {
      console.log("You dont own any credential");
      return Response.json({
        cred: undefined,
      });
    } else {
      console.log("You own the credential");
      return Response.json({
        cred,
      });
    }
  } catch (e) {
    return Response.json(
      {
        error: "Failed to fetch creds",
      },
      {
        status: 500,
      }
    );
  }
}
