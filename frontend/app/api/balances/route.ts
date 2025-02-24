export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const eth = searchParams.get('eth') || ""
    // const sol = searchParams.get('sol') || ""
    const prod = JSON.parse(searchParams.get('prod') || "false")

    console.log('Received request with parameters:', { eth, prod })

    const ethRpc = !prod ? `https://endpoints.omniatech.io/v1/arbitrum/sepolia/public` : `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
    // const solRpc = !prod ? `https://solana-devnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}` : `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
    const avaxRpc = !prod ? `https://avax-fuji.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}` : `https://avax-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
    let ethBalance = "0";
    // let solBalance = "0";
    let avaxBalance = "0";

    console.log("ETH RPC")
    console.log(ethRpc)
    try {
        console.log('Fetching ETH balance from:', ethRpc)
        const ethResponse = await fetch(ethRpc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [eth, 'latest'],
                id: 1
            }),
        });
        const ethData = await ethResponse.json();
        console.log('ETH response data:', ethData)
        if (ethData.result) ethBalance = (parseInt(ethData.result, 16) / 1e18).toString();
        else {
            console.error('Failed to fetch ETH Balance')
            return Response.json({
                error: "Failed to fetch ETH Balance",
                ethBalance: "0",
                avaxBalance: "0"
            }, {
                status: 500
            })
        }

        console.log('Fetching AVAX balance from:', avaxRpc)
        const avaxResponse = await fetch(avaxRpc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [eth, 'latest'],
                id: 1
            }),
        });
        const avaxData = await avaxResponse.json();
        console.log('AVAX response data:', avaxData)
        if (avaxData.result) avaxBalance = (parseInt(avaxData.result, 16) / 1e18).toString();
        else {
            console.error('Failed to fetch AVAX Balance')
            return Response.json({
                error: "Failed to AVAX ETH Balance",
                ethBalance: "0",
                avaxBalance: "0"
            }, {
                status: 500
            })
        }

        // console.log('Fetching SOL balance from:', solRpc)
        // const solResponse = await fetch(solRpc, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         jsonrpc: '2.0',
        //         id: 1,
        //         method: 'getBalance',
        //         params: [sol],
        //     }),
        // });
        // const solData = await solResponse.json();
        // console.log('SOL response data:', solData)
        // if (!isNaN(solData.result?.value)) solBalance = (parseFloat(solData.result.value) / 1e9).toString();
        // else {
        //     console.error('Failed to fetch SOL Balance')
        //     return Response.json({
        //         error: "Failed to fetch SOL Balance"
        //     }, {
        //         status: 500
        //     })
        // }

        console.log('Returning balances:', { ethBalance, avaxBalance })
        return Response.json({ ethBalance, avaxBalance })
    } catch (error: any) {
        console.error('Error fetching balances:', error.message)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
