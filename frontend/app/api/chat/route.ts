export async function POST(request: Request) {
    try {
        const { conversationId, tradeId, chat } = await request.json()

        return Response.json({})
    } catch (error) {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

