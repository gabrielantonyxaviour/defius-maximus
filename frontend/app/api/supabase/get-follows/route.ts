import { getFollows } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || "";
  console.log(user_id);
  try {
    const follows = await getFollows(user_id);
    return Response.json({ follows });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
