import { NextRequest, NextResponse } from 'next/server'
import { getAllFeedPosts } from '@/lib/data/posts.server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')

    // Sanitize cursor: ensure it's not "undefined", "null", or empty string
    const validCursor = cursor && cursor !== 'undefined' && cursor !== 'null' ? cursor : undefined

    console.log(`[API] Fetching posts with cursor: ${validCursor}, limit: ${limit}, userId: ${userId}`)

    const { data: posts, error } = await getAllFeedPosts(
        userId || undefined,
        limit,
        validCursor
    )

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: posts })
}
