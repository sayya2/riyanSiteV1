// Test the parser with actual database content
const mysql = require('mysql2/promise');

const stripHtml = (input) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

function parseCareerSections(html) {
  const sections = {};

  if (!html) return sections;

  // Split by h2 headings
  const parts = html.split(/<h2[^>]*>/gi);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endOfHeading = part.indexOf('</h2>');

    if (endOfHeading === -1) continue;

    const heading = stripHtml(part.substring(0, endOfHeading)).toLowerCase().trim();
    const content = part.substring(endOfHeading + 5).split(/<h2/i)[0].trim();

    if (!content) continue;

    console.log(`\n=== Found Heading: "${heading}" ===`);
    console.log(`Content length: ${content.length} chars`);
    console.log(`Preview: ${content.substring(0, 100)}...`);

    // Map headings to section keys
    if (
      heading.includes('qualification') ||
      heading.includes('requirement') ||
      heading.includes('skill') ||
      heading.includes('education')
    ) {
      sections.qualifications = (sections.qualifications || '') + content;
      console.log('→ Mapped to: QUALIFICATIONS');
    } else if (
      heading.includes('responsibilit') ||
      heading.includes('duties') ||
      heading.includes('main responsibilit')
    ) {
      sections.responsibilities = (sections.responsibilities || '') + content;
      console.log('→ Mapped to: RESPONSIBILITIES');
    } else if (
      heading.includes('benefit') ||
      heading.includes('salary') ||
      heading.includes('compensation') ||
      heading.includes('perks')
    ) {
      sections.benefits = (sections.benefits || '') + content;
      console.log('→ Mapped to: BENEFITS');
    } else if (
      heading.includes('description') ||
      heading.includes('about the role') ||
      heading.includes('job summary') ||
      heading.includes('overview')
    ) {
      sections.description = (sections.description || '') + content;
      console.log('→ Mapped to: DESCRIPTION');
    } else if (
      heading.includes('must have') ||
      heading.includes('required') ||
      heading.includes('essential')
    ) {
      sections.requirements = (sections.requirements || '') + content;
      console.log('→ Mapped to: REQUIREMENTS');
    } else {
      console.log('→ SKIPPED (not mapped)');
    }
  }

  return sections;
}

async function testParser() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'riyan_user',
    password: 'riyan_password',
    database: 'riyan_nextjs',
    port: 3307,
  });

  // Get the Project Manager post
  const [rows] = await connection.query(`
    SELECT post_title, post_content
    FROM wp_posts
    WHERE ID = 2
  `);

  if (rows.length === 0) {
    console.log('Post not found!');
    await connection.end();
    return;
  }

  const post = rows[0];
  console.log(`\n========================================`);
  console.log(`Testing Parser for: ${post.post_title}`);
  console.log(`========================================`);

  const sections = parseCareerSections(post.post_content);

  console.log(`\n\n========================================`);
  console.log(`FINAL PARSED SECTIONS:`);
  console.log(`========================================`);

  Object.entries(sections).forEach(([key, value]) => {
    console.log(`\n${key.toUpperCase()}:`);
    console.log(`Length: ${value.length} chars`);
    console.log(`Preview: ${value.substring(0, 150)}...`);
  });

  await connection.end();
}

testParser().catch(console.error);
