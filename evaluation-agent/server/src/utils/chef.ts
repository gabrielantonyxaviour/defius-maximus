import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export async function getChef(chefId: string): Promise<string> {
  console.log(process.env.SUPABASE_URL);
  console.log(`Fetching chef profile for chefId: ${chefId}`);

  const { data: chefProfile, error: profileError } = await supabase
    .from("chef_profile")
    .select("*")
    .eq("id", chefId)
    .single();

  if (profileError) {
    console.error("Error fetching chef profile:", profileError);
    return "";
  }

  console.log("Chef profile fetched successfully:", chefProfile);

  return `
Chef Profile:
- **User Id:** ${chefProfile.user_id}
- **Followers:** ${chefProfile.total_subscribers}
- **Avg. PNL %:** ${chefProfile.avg_pnl_percentage.toFixed(3)}
- **Avg. Calls per Day:** ${chefProfile.avg_calls_per_day.toFixed(3)}
`;
}
