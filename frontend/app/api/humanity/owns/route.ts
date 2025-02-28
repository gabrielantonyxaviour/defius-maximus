import { ownsCreds } from "@/lib/humanity";
import { Hex } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const credId = searchParams.get("credId");

  try {
    const cred = await ownsCreds(address as Hex, credId as string);
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
