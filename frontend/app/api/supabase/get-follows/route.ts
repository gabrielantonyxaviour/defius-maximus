import { getFollows } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || ""
    console.log(username)
    try {
        const follows = await getFollows(username)
        return Response.json({ follows })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}