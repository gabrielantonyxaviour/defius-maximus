import { getChef } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || "";

  try {
    const chef = await getChef(user_id);
    return Response.json({ chef });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
