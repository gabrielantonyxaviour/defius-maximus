import { updateChef } from '@/lib/supabase'
export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body.chefname) {
            return Response.json(
                { error: 'chefname is required' },
                { status: 400 }
            )
        }

        const chef = await updateChef(body)

        if (!chef) {
            return Response.json(
                { error: 'Failed to update chef' },
                { status: 400 }
            )
        }

        return Response.json({ chef })
    } catch (error) {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}