import { followChef } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const { chef_id, user_id, confidence_level } = await request.json();

    if (!user_id || !chef_id) {
      return Response.json(
        { error: "user_id and chef_id is required" },
        { status: 400 }
      );
    }
    console.log({
      chef_id,
      user_id,
      confidence_level,
    });
    const success = await followChef({
      chef_id,
      user_id: user_id,
      confidence_level,
    });

    if (!success) {
      return Response.json({ error: "Failed to follow chef" }, { status: 400 });
    }

    return Response.json({ success });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
