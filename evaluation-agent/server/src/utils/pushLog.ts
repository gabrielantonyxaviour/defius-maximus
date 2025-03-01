import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || ""; // Using service key for server-side operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Log types
export enum LogType {
  INFO = 0, // Short informational messages
  DETAILED = 1, // Long detailed analysis
  JSON = 2, // JSON data
}

export async function createLog(
  tradePlayId: string,
  title: string,
  content: string,
  type: LogType,
  externalLink: string = ""
) {
  try {
    const { data, error } = await supabase.from("trade_analysis_logs").insert([
      {
        trade_play_id: tradePlayId,
        title,
        content,
        type,
        external_link: externalLink,
      },
    ]);

    if (error) {
      console.error("Error creating log:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception creating log:", err);
    return { success: false, error: err };
  }
}
