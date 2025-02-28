import { updateCredIdByUserId } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const { credId, address } = await request.json();

    if (!credId) {
      return Response.json({ error: "cred Id is required" }, { status: 400 });
    }
    if (!address) {
      return Response.json({ error: "address is required" }, { status: 400 });
    }

    await updateCredIdByUserId(address, credId);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
