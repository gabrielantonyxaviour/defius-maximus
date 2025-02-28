import { getRegistered } from "@/lib/humanity";
import { Hex } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("Received request:", request.url);
  try {
    const address = searchParams.get("address");
    console.log("Address parameter:", address);
    const isRegistered = await getRegistered(address as Hex);
    console.log("isRegistered result:", isRegistered);
    return Response.json({
      isRegistered,
    });
  } catch (e) {
    console.error("Error fetching isRegistered:", e);
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
