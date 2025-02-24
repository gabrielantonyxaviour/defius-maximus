// app/api/users/route.ts
import { createUser } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await createUser(body);

    if (!user) {
      return Response.json({ error: "Failed to create user" }, { status: 400 });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
