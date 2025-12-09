import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get a sample career post
    const [posts] = await pool.query<any[]>(`
      SELECT p.ID, p.post_title, p.post_name, p.post_content
      FROM wp_posts p
      WHERE (p.post_type IN ('career', 'careers')
        OR (p.post_type = 'page' AND p.post_parent IN
          (SELECT ID FROM wp_posts WHERE post_name = 'career' AND post_type = 'page')))
      AND p.post_status = 'publish'
      LIMIT 1
    `);

    if (posts.length === 0) {
      return NextResponse.json({ error: 'No career posts found' }, { status: 404 });
    }

    const post = posts[0];

    // Get all meta keys for this career post
    const [meta] = await pool.query<any[]>(`
      SELECT meta_key, meta_value
      FROM wp_postmeta
      WHERE post_id = ?
      AND meta_key NOT LIKE '\\_%'
      ORDER BY meta_key
    `, [post.ID]);

    // Get common job-related meta keys
    const [jobMeta] = await pool.query<any[]>(`
      SELECT meta_key, meta_value
      FROM wp_postmeta
      WHERE post_id = ?
      AND meta_key IN ('responsibilities', 'requirements', 'qualifications', 'benefits',
                       'job_description', 'description', 'duties', 'skills')
      ORDER BY meta_key
    `, [post.ID]);

    return NextResponse.json({
      post: {
        id: post.ID,
        title: post.post_title,
        slug: post.post_name,
        content_preview: post.post_content?.substring(0, 500),
      },
      all_meta_fields: meta.map((m: any) => ({
        key: m.meta_key,
        value_preview: m.meta_value?.substring(0, 100),
      })),
      job_specific_meta: jobMeta.length > 0 ? jobMeta : null,
      message: jobMeta.length > 0
        ? 'Found job-specific meta fields!'
        : 'No job-specific meta fields found - data is likely in post_content HTML',
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: 'Database query failed',
    }, { status: 500 });
  }
}
