import { NextRequest, NextResponse } from 'next/server'
import { getAllFeedPosts } from '@/lib/data/posts.server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')

    const { data: posts, error } = await getAllFeedPosts(
        userId || undefined,
        limit,
        cursor || undefined
    )

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: posts })
}
