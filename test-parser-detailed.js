// Test the updated parser
const mysql = require('mysql2/promise');
const fs = require('fs');

const stripHtml = (input) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

function parseCareerSections(html) {
  const sections = {};

  if (!html) return sections;

  console.log('\n=== PARSING HTML ===');
  console.log('Total HTML length:', html.length);

  // Extract job description from initial content before first h2
  const beforeFirstH2 = html.split(/<h2[^>]*>/i)[0];
  console.log('\n--- Before First H2 ---');
  console.log('Length:', beforeFirstH2.length);
  console.log('Content:', beforeFirstH2.substring(0, 300));

  const descriptionMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/is);
  if (descriptionMatch && descriptionMatch[1].length > 20) {
    sections.description = `<p>${descriptionMatch[1]}</p>`;
    console.log('✓ Found description:', descriptionMatch[1].substring(0, 100));
  } else {
    console.log('✗ No description found');
  }

  // Split by h2 headings
  const parts = html.split(/<h2[^>]*>/gi);
  console.log('\n--- H2 Sections Found:', parts.length - 1);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endOfHeading = part.indexOf('</h2>');

    if (endOfHeading === -1) continue;

    const heading = stripHtml(part.substring(0, endOfHeading)).toLowerCase().trim();
    let content = part.substring(endOfHeading + 5).split(/<h2/i)[0].trim();

    console.log(`\n[Section ${i}] Heading: "${heading}"`);
    console.log('Content length:', content.length);

    if (!content) {
      console.log('→ SKIPPED (empty content)');
      continue;
    }

    // Check for responsibilities section
    if (
      heading.includes('responsibilit') ||
      heading.includes('duties') ||
      heading.includes('main responsibilit')
    ) {
      console.log('→ Processing RESPONSIBILITIES');

      // Check if benefits are embedded
      const benefitsMarkerRegex = /<li[^>]*>.*?(salary\s+and\s+benefits|benefits\s*:?).*?<\/li>/is;
      const markerMatch = content.match(benefitsMarkerRegex);

      if (markerMatch) {
        console.log('  ✓ Found benefits marker:', markerMatch[0].substring(0, 100));

        const markerIndex = content.indexOf(markerMatch[0]);
        const beforeMarker = content.substring(0, markerIndex);
        const afterMarker = content.substring(markerIndex + markerMatch[0].length);

        console.log('  - Responsibilities length:', beforeMarker.length);
        console.log('  - Benefits length:', afterMarker.length);

        sections.responsibilities = beforeMarker + '</ul>';

        if (afterMarker.trim()) {
          const benefitsContent = afterMarker.trim().startsWith('<ul>')
            ? afterMarker
            : '<ul>' + afterMarker;
          sections.benefits = benefitsContent;
          console.log('  ✓ Split into responsibilities + benefits');
        }
      } else {
        console.log('  ✗ No benefits marker found, keeping all as responsibilities');
        sections.responsibilities = content;
      }
    } else if (
      heading.includes('qualification') ||
      heading.includes('requirement')
    ) {
      if (heading.includes('qualification')) {
        sections.qualifications = content;
        console.log('→ Mapped to QUALIFICATIONS');
      } else {
        sections.requirements = content;
        console.log('→ Mapped to REQUIREMENTS');
      }
    } else {
      console.log('→ SKIPPED (not mapped)');
    }
  }

  return sections;
}

async function test() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'riyan_user',
    password: 'riyan_password',
    database: 'riyan_nextjs',
    port: 3307,
  });

  const [rows] = await connection.query('SELECT post_title, post_content FROM wp_posts WHERE ID = 2');
  const post = rows[0];

  console.log('\n========================================');
  console.log(`Testing: ${post.post_title}`);
  console.log('========================================');

  const sections = parseCareerSections(post.post_content);

  console.log('\n\n========================================');
  console.log('FINAL SECTIONS:');
  console.log('========================================');

  Object.entries(sections).forEach(([key, value]) => {
    console.log(`\n${key.toUpperCase()}:`);
    console.log(`Length: ${value.length} chars`);
    console.log(`Preview: ${value.substring(0, 200)}...`);
  });

  // Save to file for inspection
  fs.writeFileSync('parsed-sections.json', JSON.stringify(sections, null, 2));
  console.log('\n✓ Saved to parsed-sections.json');

  await connection.end();
}

test().catch(console.error);
