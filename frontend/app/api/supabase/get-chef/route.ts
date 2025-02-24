import { getChef } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || ""

    try {
        const chef = await getChef(username)
        return Response.json({ chef })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}