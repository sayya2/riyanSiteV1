import pool from './src/lib/db.ts';

async function checkCareerMeta() {
  try {
    // Get a sample career post
    const [posts] = await pool.query(`
      SELECT p.ID, p.post_title, p.post_name
      FROM wp_posts p
      WHERE (p.post_type IN ('career', 'careers')
        OR (p.post_type = 'page' AND p.post_parent IN
          (SELECT ID FROM wp_posts WHERE post_name = 'career' AND post_type = 'page')))
      AND p.post_status = 'publish'
      LIMIT 1
    `);

    if (posts.length === 0) {
      console.log('No career posts found');
      process.exit(0);
    }

    const careerId = posts[0].ID;
    console.log(`Checking meta fields for: ${posts[0].post_title} (ID: ${careerId})`);
    console.log('---');

    // Get all meta keys for this career post
    const [meta] = await pool.query(`
      SELECT meta_key, LEFT(meta_value, 100) as meta_value_preview
      FROM wp_postmeta
      WHERE post_id = ?
      AND meta_key NOT LIKE '\\_%'
      ORDER BY meta_key
    `, [careerId]);

    console.log('Custom meta fields:');
    meta.forEach(row => {
      console.log(`  ${row.meta_key}: ${row.meta_value_preview}...`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkCareerMeta();
