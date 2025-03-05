import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_KEY!, // Use Service Role Key
//   { auth: { persistSession: false } }
// );
// export async function GET(req: NextRequest) {
//   const encoder = new TextEncoder();

//   // Create a ReadableStream to send real-time events
//   const stream = new ReadableStream({
//     start(controller) {
//       supabase
//         .channel("server-realtime")
//         .on(
//           "postgres_changes",
//           { event: "INSERT", schema: "public", table: "your_table" },
//           (payload) => {
//             console.log("New row inserted:", payload.new);
//             controller.enqueue(
//               encoder.encode(`data: ${JSON.stringify(payload.new)}\n\n`)
//             );
//           }
//         )
//         .subscribe();
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello, World!" });
}
