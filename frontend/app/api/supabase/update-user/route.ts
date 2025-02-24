import { updateUser } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    const user = await updateUser(body);

    if (!user) {
      return Response.json({ error: "Failed to update user" }, { status: 400 });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
