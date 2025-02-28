import { getRegistered } from "@/lib/humanity";
import { Hex } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const isRegistered = await getRegistered(
      searchParams.get("address") as Hex
    );
    return Response.json({
      isRegistered,
    });
  } catch (e) {
    return Response.json(
      {
        error: "Failed to fetch isRegistered",
      },
      {
        status: 500,
      }
    );
  }
}
