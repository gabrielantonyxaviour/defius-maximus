import { getAllChefs } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        const chefs = await getAllChefs()
        return Response.json({ chefs })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}