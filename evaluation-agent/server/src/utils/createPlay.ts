import { createClient } from "@supabase/supabase-js";
import { TradePlay } from "../types.js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPlay({
    chef_id, asset, direction, entry_price, stop_loss, leverage, trade_type, timeframe, status, pnl_percentage, research_description, dex, image, chain, take_profit, dca, expected_pnl, analysis
}: TradePlay) {
    console.log(`Chef with chef_id: ${chef_id} is posting a play`);
    const { data, error } = await supabase
        .from('trade_plays')
        .insert({ chef_id, asset, direction, entry_price, stop_loss, leverage, trade_type, timeframe, status, pnl_percentage, research_description, dex, image, chain, take_profit, dca, expected_pnl, analysis })
        .select()
        .single();
    if (error) {
        console.error(`Error creating play: ${error.message}`);
        return null;
    }
    console.log(`Play created successfully: ${JSON.stringify(data)}`);
    return data;
}
