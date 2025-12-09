// Parse career post_content into separate sections

const stripHtml = (input: string) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export interface CareerSections {
  description?: string;
  responsibilities?: string;
  qualifications?: string;
  requirements?: string;
  benefits?: string;
}

export function parseCareerSections(html: string): CareerSections {
  const sections: CareerSections = {};

  if (!html) return sections;

  // Extract job description from initial content before first h2
  let beforeFirstH2 = html.split(/<h2[^>]*>/i)[0];
  // Remove style and script tags first
  beforeFirstH2 = beforeFirstH2
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  const descriptionMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/is);
  if (descriptionMatch && stripHtml(descriptionMatch[1]).length > 20) {
    sections.description = `<p>${descriptionMatch[1]}</p>`;
  }

  // Split by h2 headings
  const parts = html.split(/<h2[^>]*>/gi);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endOfHeading = part.indexOf('</h2>');

    if (endOfHeading === -1) continue;

    const heading = stripHtml(part.substring(0, endOfHeading)).toLowerCase().trim();
    let content = part.substring(endOfHeading + 5).split(/<h2/i)[0].trim();

    if (!content) continue;

    // Map headings to section keys
    if (
      heading.includes('qualification') ||
      heading.includes('requirement') ||
      heading.includes('skill') ||
      heading.includes('education')
    ) {
      // Extract requirements vs qualifications
      if (heading.includes('qualification')) {
        sections.qualifications = (sections.qualifications || '') + content;
      } else {
        sections.requirements = (sections.requirements || '') + content;
      }
    } else if (
      heading.includes('responsibilit') ||
      heading.includes('duties') ||
      heading.includes('main responsibilit')
    ) {
      // Check if benefits are embedded in responsibilities
      // Look for the specific pattern: "...Director. Salary and Benefits</li>"
      // Use non-greedy match and check each li separately
      const listItems = content.match(/<li[^>]*>.*?<\/li>/gs) || [];

      let benefitsStartIndex = -1;
      let benefitsMarkerItem = '';

      for (const item of listItems) {
        if (/\.\s+Salary\s+and\s+Benefits\s*<\/li>/i.test(item)) {
          benefitsMarkerItem = item;
          benefitsStartIndex = content.indexOf(item);
          break;
        }
      }

      if (benefitsStartIndex !== -1 && benefitsMarkerItem) {
        // The marker item contains BOTH last responsibility AND "Salary and Benefits"
        // Example: "<li>...Managing Director. Salary and Benefits</li>"
        // We need to extract the responsibility part and discard the marker text

        const beforeMarkerLi = content.substring(0, benefitsStartIndex);
        const afterMarkerLi = content.substring(benefitsStartIndex + benefitsMarkerItem.length);

        // Extract just the responsibility text from the marker item (before "Salary and Benefits")
        const responsibilityTextMatch = benefitsMarkerItem.match(/<li[^>]*>(.*?)\.\s+Salary\s+and\s+Benefits/i);

        let cleanedResponsibilityLi = '';
        if (responsibilityTextMatch && responsibilityTextMatch[1].trim()) {
          // Create a clean li with just the responsibility text
          cleanedResponsibilityLi = `<li>${responsibilityTextMatch[1]}.</li>\n`;
        }

        // Everything before marker + cleaned responsibility goes to responsibilities
        sections.responsibilities = (sections.responsibilities || '') + beforeMarkerLi + cleanedResponsibilityLi + '</ul>';

        // Everything after marker goes to benefits
        if (afterMarkerLi.trim()) {
          const benefitsContent = '<ul>' + afterMarkerLi;
          sections.benefits = (sections.benefits || '') + benefitsContent;
        }
      } else {
        sections.responsibilities = (sections.responsibilities || '') + content;
      }
    } else if (
      heading.includes('benefit') ||
      heading.includes('salary') ||
      heading.includes('compensation') ||
      heading.includes('perks')
    ) {
      sections.benefits = (sections.benefits || '') + content;
    } else if (
      heading.includes('description') ||
      heading.includes('about the role') ||
      heading.includes('job summary') ||
      heading.includes('overview')
    ) {
      sections.description = (sections.description || '') + content;
    } else if (
      heading.includes('must have') ||
      heading.includes('required') ||
      heading.includes('essential')
    ) {
      sections.requirements = (sections.requirements || '') + content;
    }
    // Skip sections like "Apply", "Deadline", "No. of vacancies", "Type of Application"
  }

  return sections;
}
