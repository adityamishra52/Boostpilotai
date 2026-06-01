const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const cleanText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeForDedupe = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/^[-*\d.)\s]+/, "")
    .replace(/[.,;:!?\s]+$/g, "");

const uniqueList = (...groups) => {
  const seen = new Set();
  const items = [];

  groups.flatMap(toArray).forEach((item) => {
    const text = cleanText(item);
    const key = normalizeForDedupe(text);

    if (!text || seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push(text);
  });

  return items;
};

const addSection = (sections, title, value, { numbered = false } = {}) => {
  const items = Array.isArray(value) ? uniqueList(value) : [];
  const body = Array.isArray(value) ? "" : cleanText(value);

  if (!body && !items.length) {
    return;
  }

  sections.push({ body, items, numbered, title });
};

const renderSection = ({ body, items, numbered, title }) => {
  const lines = [`## ${title}`];

  if (body) {
    lines.push("", body);
  }

  if (items.length) {
    lines.push("");
    items.forEach((item, index) => {
      lines.push(numbered ? `${index + 1}. ${item}` : `- ${item}`);
    });
  }

  return lines.join("\n");
};

export const buildAnalysisReport = (analysis = {}) => {
  const output = analysis.aiOutput || {};
  const technical = output.technicalAnalysis || {};
  const engagement = output.engagementAnalysis || {};
  const titles = uniqueList(output.titleIdeas);
  const suggestedTitle = titles[0] || "";
  const alternativeTitles = titles.slice(1);
  const recommendedFixes = uniqueList(
    output.improvementSuggestions,
    output.engagementSuggestions,
    technical.fixSuggestions,
    output.platformSpecificSuggestions
  );
  const platformRecommendation = uniqueList(technical.platformFit, output.platformSpecificSuggestions);
  const sections = [];

  addSection(sections, "Content Summary", output.summary);
  addSection(sections, "Overall Score", output.contentScore !== undefined ? `${output.contentScore}/100` : "");
  addSection(sections, "Suggested Title", suggestedTitle);
  addSection(sections, "Alternative Titles", alternativeTitles);
  addSection(sections, "Caption", output.viralCaption || output.improvedPostVersion);
  addSection(sections, "Hashtags", uniqueList(output.hashtags));
  addSection(sections, "Hooks", uniqueList(output.hookLines));
  addSection(sections, "CTA", uniqueList(output.cta, output.ctaSuggestions));
  addSection(sections, "Strengths", uniqueList(engagement.strengths));
  addSection(sections, "Weaknesses", uniqueList(engagement.weaknesses));
  addSection(sections, "Technical Issues", uniqueList(technical.qualityIssues));
  addSection(sections, "Recommended Fixes", recommendedFixes, { numbered: true });
  addSection(sections, "Target Audience", output.targetAudience);
  addSection(sections, "Platform Recommendation", platformRecommendation);

  return sections.map(renderSection).join("\n\n");
};
