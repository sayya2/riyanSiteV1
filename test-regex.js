const testContent = `<ul>
<li>Prime or secondary point of contact for the Client/Project Director/Contractor/other parties.</li>
<li>Develop full-scale project plans and associated communications documents.</li>
<li>Any other related responsibility as requested by the reporting Team Leader/Head/Director or Managing Director. Salary and Benefits</li>
<li>Competitive Salary based on qualifications and experience</li>
<li>Variable allowance based on level of effort</li>
<li>Health Insurance</li>
<li>Staff Development Trainings</li>
</ul>`;

// Test different regex patterns
const patterns = [
  { name: 'Pattern 1', regex: /<li[^>]*>.*?(?:\.|\?|!)\s*(salary\s+and\s+benefits|benefits\s*:?)\s*<\/li>/is },
  { name: 'Pattern 2', regex: /<li[^>]*>.*?Director\.\s+Salary\s+and\s+Benefits\s*<\/li>/is },
  { name: 'Pattern 3', regex: /<li[^>]*>.*?\.\s+Salary\s+and\s+Benefits\s*<\/li>/is },
];

patterns.forEach(p => {
  console.log(`\n${p.name}:`);
  const match = testContent.match(p.regex);
  if (match) {
    console.log('  ✓ Match found:', match[0]);
    const index = testContent.indexOf(match[0]);
    console.log('  Index:', index);
    console.log('  Before:', testContent.substring(0, index).substring(0, 100));
  } else {
    console.log('  ✗ No match');
  }
});
