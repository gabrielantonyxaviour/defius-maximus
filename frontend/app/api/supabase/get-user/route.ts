import { getUser } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "";

  try {
    const user = await getUser(username);
    return Response.json({ user: user });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
