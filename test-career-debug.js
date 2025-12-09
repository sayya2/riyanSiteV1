// Run this with: node test-career-debug.js
// To check what data is in the database for a career post

const mysql = require('mysql2/promise');

async function testCareer() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'riyan_user',
    password: 'riyan_password',
    database: 'riyan_nextjs',
    port: 3307,
  });

  // Get a sample career post
  const [posts] = await connection.query(`
    SELECT
      p.ID,
      p.post_title,
      p.post_name,
      p.post_type
    FROM wp_posts p
    WHERE p.post_status = 'publish'
      AND (p.post_type = 'career' OR p.post_type = 'page')
    ORDER BY p.post_date DESC
    LIMIT 20
  `);

  console.log('\n=== Available Career Posts ===');
  posts.forEach(p => {
    console.log(`${p.ID}: ${p.post_title} (${p.post_name}) [${p.post_type}]`);
  });

  if (posts.length === 0) {
    console.log('No posts found!');
    await connection.end();
    return;
  }

  // Pick first post
  const testPost = posts[0];
  console.log(`\n=== Checking Post: ${testPost.post_title} (ID: ${testPost.ID}) ===`);

  // Get all meta fields for this post
  const [meta] = await connection.query(`
    SELECT meta_key, LEFT(meta_value, 100) as meta_preview, LENGTH(meta_value) as value_length
    FROM wp_postmeta
    WHERE post_id = ?
      AND meta_key IN ('job_description', 'responsibilities', 'requirements', 'qualifications', 'benefits',
                       'description', 'duties', 'required_skills', 'education', 'perks')
    ORDER BY meta_key
  `, [testPost.ID]);

  console.log('\n=== Meta Fields Found ===');
  if (meta.length === 0) {
    console.log('No career meta fields found for this post!');
  } else {
    meta.forEach(m => {
      console.log(`\n${m.meta_key} (${m.value_length} chars):`);
      console.log(m.meta_preview.substring(0, 80) + '...');
    });
  }

  await connection.end();
}

testCareer().catch(console.error);
