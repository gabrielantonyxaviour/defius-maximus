import { Chef, ExecutedTrade, TradePlay, User } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUser(user_id: string): Promise<User | null> {
  console.log(`Fetching user with user_id: ${user_id}`);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.log(`Error fetching user: ${error.message}`);
    return null;
  }
  console.log(`User fetched successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function getFollows(id: string): Promise<string[]> {
  console.log(`Fetching follows for user with id: ${id}`);
  const { data, error } = await supabase
    .from("user_follows")
    .select("chef_id")
    .eq("user_id", id);

  if (error) {
    console.error(`Error fetching follows: ${error.message}`);
    return [];
  }
  console.log(
    `Follows fetched successfully: ${JSON.stringify(
      data.map(({ chef_id }) => chef_id)
    )}`
  );
  return data.map(({ chef_id }) => chef_id);
}
export async function getRecipes(id: string): Promise<TradePlay[]> {
  console.log(`Fetching recipes for chefs with id: ${id}`);
  const { data, error } = await supabase
    .from("trade_plays")
    .select("*")
    .eq("chef_id", id);

  if (error) {
    console.error(`Error fetching recipes: ${error.message}`);
    return [];
  }
  console.log(`Recipes fetched successfully: ${JSON.stringify(data)}`);
  return data;
}
export async function getChef(user_id: string): Promise<Chef | null> {
  console.log(`Fetching chef with user_id: ${user_id}`);

  const { data, error } = await supabase
    .from("chef_profile")
    .select("*")
    .eq("username", user_id)
    .single();

  if (error) {
    console.error(`Error fetching chef: ${error.message}`);
    return null;
  }

  console.log(`Chef fetched successfully: ${JSON.stringify(data)}`);
  return data;
}
export async function getAllChefs(): Promise<Chef[]> {
  const { data, error } = await supabase.from("chef_profile").select("*");

  if (error) {
    console.error(`Error fetching chef: ${error.message}`);
    return [];
  }

  console.log(`Chef fetched successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function createChef({
  user_id,
  name,
  bio,
  image,
  sub_fee,
  niche,
  nftName,
  nftSymbol,
  ipAddress,
  twitter,
}: {
  user_id: string;
  name: string;
  bio: string;
  niche: string[];
  image?: string;
  sub_fee?: string;
  nftName: string;
  nftSymbol: string;
  ipAddress: string;
  twitter: string;
}): Promise<Chef | null> {
  console.log(`Creating chef with user id: ${user_id}`);
  const { data, error } = await supabase
    .from("chefs")
    .insert([
      {
        user_id,
        name,
        bio,
        image,
        niche,
        sub_fee,
        nft_name: nftName,
        nft_symbol: nftSymbol,
        ip_address: ipAddress,
        twitter,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(`Error creating chef: ${error.message}`);
    return null;
  }
  console.log(`Chef created successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function updateChef({
  user_id,
  name,
  bio,
  image,
  sub_fee,
}: {
  user_id: string;
  name?: string;
  bio?: string;
  image?: string;
  sub_fee?: string;
}): Promise<Chef | null> {
  console.log(`Updating chef with user_id: ${user_id}`);
  const { data, error } = await supabase
    .from("chefs")
    .update({ name, bio, image, sub_fee })
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating chef: ${error.message}`);
    return null;
  }
  console.log(`Chef updated successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function createUser(user: User): Promise<User | null> {
  console.log(`Creating user with user_id: ${user.id}`);
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single();

  if (error) {
    console.error(`Error creating user: ${error.message}`);
    return null;
  }
  console.log(`User created successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function updateUser(user: User): Promise<User | null> {
  console.log(`Updating user with user id: ${user.id}`);
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating user: ${error.message}`);
    return null;
  }
  console.log(`User updated successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function storeImage(
  fileName: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("chef_images")
    .upload(fileName, file, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading image: ${error.message}`);
    return "";
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("chef_images").getPublicUrl(fileName);

  console.log(`Image uploaded successfully: ${publicUrl}`);
  return publicUrl;
}

export async function followChef({
  chef_id,
  user_id,
  confidence_level,
}: {
  chef_id: string;
  user_id: string;
  confidence_level: number;
}) {
  console.log(`${user_id} is following chef with id: ${chef_id}`);
  const { data, error } = await supabase
    .from("user_follows")
    .upsert(
      { chef_id, user_id, confidence_level, last_subscribed_at: new Date() },
      { onConflict: "chef_id,user_id" }
    )
    .select()
    .single();
  if (error) {
    console.error(`Error creating subscription: ${error.message}`);
    return null;
  }
  console.log(`Chef Followed successfully: ${JSON.stringify(data)}`);
  return {
    success: true,
  };
}

export async function createPlay({
  chef_id,
  asset,
  direction,
  entry_price,
  stop_loss,
  leverage,
  trade_type,
  timeframe,
  status,
  pnl_percentage,
  research_description,
  dex,
  image,
  chain,
  take_profit,
  dca,
  expected_pnl,
}: TradePlay) {
  console.log(`Chef with chef_id: ${chef_id} is posting a play`);
  const { data, error } = await supabase
    .from("trade_plays")
    .insert({
      chef_id,
      asset,
      direction,
      entry_price,
      stop_loss,
      leverage,
      trade_type,
      timeframe,
      status,
      pnl_percentage,
      research_description,
      dex,
      image,
      chain,
      take_profit,
      dca,
      expected_pnl,
    })
    .select()
    .single();
  if (error) {
    console.error(`Error creating play: ${error.message}`);
    return null;
  }
  console.log(`Play created successfully: ${JSON.stringify(data)}`);
  return data;
}

export async function fetchExecutedTrades(
  user_id: string
): Promise<ExecutedTrade[]> {
  const { data: executedTrades, error: tradesError } = await supabase
    .from("executed_trades")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (tradesError) throw tradesError;

  // Then get the trade plays with chefs for those trades
  const { data: tradePlays, error: playsError } = await supabase
    .from("trade_plays")
    .select(
      `
        *,
        chef:chefs(
            user_id
        )
    `
    )
    .in(
      "id",
      executedTrades.map((trade) => trade.trade_play_id)
    );

  if (playsError) throw playsError;

  // Combine the data
  const combinedData = executedTrades.map((trade) => ({
    ...trade,
    trade_play: tradePlays.find((play) => play.id === trade.trade_play_id),
  }));

  console.log(combinedData);
  return combinedData as ExecutedTrade[];
}
