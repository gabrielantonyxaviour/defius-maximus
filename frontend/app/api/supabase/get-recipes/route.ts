import { getRecipes } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const chef = searchParams.get('chef') || ""

    try {
        const recipes = await getRecipes(chef)
        return Response.json({ recipes })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}