import { NextResponse } from 'next/server';
import { getAllFeedPosts } from '@/lib/data/posts.server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
  noStore();
  try {
    // This function is server-side and can use cookies() internally
    const { data, error } = await getAllFeedPosts();

    if (error) {
      console.error("API Error fetching feed posts:", error);
      return NextResponse.json({ message: "Erreur lors de la récupération des posts." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("API CATCH Error fetching feed posts:", e);
    return NextResponse.json({ message: "Une erreur inattendue est survenue." }, { status: 500 });
  }
}
