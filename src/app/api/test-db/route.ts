import { NextResponse } from 'next/server';
import { getMenuItems, getPosts } from '@/lib/db';

export async function GET() {
  try {
    const menuItems = await getMenuItems();
    const posts = await getPosts('page', 5);

    return NextResponse.json({
      success: true,
      menuItems,
      posts: posts.map(p => ({
        id: p.ID,
        title: p.post_title,
        excerpt: p.post_excerpt,
      })),
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database connection failed'
      },
      { status: 500 }
    );
  }
}
