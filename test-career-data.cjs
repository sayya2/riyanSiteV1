const mysql = require('mysql2/promise');

async function testCareerData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'riyan_nextjs',
      port: 3306,
    });

    // Get a sample career post
    const [posts] = await connection.query(`
      SELECT p.ID, p.post_title, p.post_name
      FROM wp_posts p
      WHERE (p.post_type IN ('career', 'careers')
        OR (p.post_type = 'page' AND p.post_parent IN
          (SELECT ID FROM wp_posts WHERE post_name = 'career' AND post_type = 'page')))
      AND p.post_status = 'publish'
      LIMIT 1
    `);

    if (posts.length === 0) {
      console.log('No career posts found in database');
      return;
    }

    const post = posts[0];
    console.log(`\nFound career post: "${post.post_title}"`);
    console.log(`Slug: ${post.post_name}`);
    console.log(`URL: http://localhost:3000/firm/career/${post.post_name}\n`);

    // Check for meta fields
    const [meta] = await connection.query(`
      SELECT meta_key, LEFT(meta_value, 200) as preview
      FROM wp_postmeta
      WHERE post_id = ?
      AND meta_key IN ('job_description', 'description', 'responsibilities', 'duties',
                       'requirements', 'required_skills', 'qualifications', 'education',
                       'benefits', 'perks')
      ORDER BY meta_key
    `, [post.ID]);

    if (meta.length === 0) {
      console.log('No meta fields found - data is in post_content HTML');
    } else {
      console.log('Meta fields found:');
      meta.forEach(row => {
        console.log(`  ✓ ${row.meta_key}: ${row.preview}...`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testCareerData();
