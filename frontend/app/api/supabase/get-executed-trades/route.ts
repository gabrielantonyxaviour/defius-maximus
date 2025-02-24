import { fetchExecutedTrades } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || ""

    try {
        const trades = await fetchExecutedTrades(username)
        return Response.json({ trades })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}