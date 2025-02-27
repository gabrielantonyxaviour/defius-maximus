import { storeImage } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    console.log("Received request to create play");
    const formData = await request.formData();
    const chef_id = formData.get("chef_id") as string;
    const name = formData.get("name") as string;
    const asset = formData.get("asset") as string;
    const direction = formData.get("direction") as string;
    const chain = formData.get("chain") as string;
    const entryPrice = parseFloat(formData.get("entry_price") as string);
    const stopLoss = parseFloat(formData.get("stop_loss") as string);
    const leverage = parseFloat(formData.get("leverage") as string);
    const timeFrame = parseFloat(formData.get("timeframe") as string);
    const researchDescription = formData.get("research_description") as string;
    const type = formData.get("trade_type") as string;
    const dex = formData.get("dex") as string;
    const imageUrl = formData.get("image_url") as string;
    const takeProfits = JSON.parse(formData.get("take_profit") as string);
    const dcaPoints = JSON.parse(formData.get("dca") as string);
    const expectedPnl = formData.get("expected_pnl") as string;

    console.log("Creating trade play with data:", {
      chef_id,
      asset,
      direction,
      entry_price: entryPrice.toString(),
      stop_loss: stopLoss.toString(),
      leverage: leverage.toString(),
      trade_type: type,
      timeframe: timeFrame.toString(),
      status: "ongoing",
      pnl_percentage: null,
      research_description: researchDescription,
      dex,
      image: imageUrl,
      chain,
      take_profit: takeProfits,
      dca: dcaPoints,
      expected_pnl: expectedPnl,
    });
    const response = await fetch(
      "https://notable-honestly-urchin.ngrok-free.app/trading/play",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: name,
          tradePlay: {
            chef_id,
            asset,
            direction,
            entry_price: entryPrice.toString(),
            stop_loss: stopLoss.toString(),
            leverage: leverage.toString(),
            trade_type: type,
            timeframe: timeFrame.toString(),
            status: "ongoing",
            pnl_percentage: null,
            research_description: researchDescription,
            dex,
            image: imageUrl,
            chain,
            take_profit: takeProfits,
            dca: dcaPoints,
            expected_pnl: expectedPnl,
          },
        }),
      }
    );
    const responseData = await response.json();
    const { data: play, error } = responseData;
    if (error) {
      console.error("Error creating play");
      console.log(error);
      return Response.json({ error: "Error creating play" }, { status: 500 });
    }

    console.log("Play created successfully:", play);
    return Response.json({ play });
  } catch (error) {
    console.error("Internal server error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
