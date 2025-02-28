import { fetchExecutedTrades } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || "";

  try {
    const trades = await fetchExecutedTrades(user_id);
    return Response.json({ trades });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
