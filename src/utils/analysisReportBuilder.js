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
  const isTwitter = analysis.platform === "Twitter/X" || analysis.platform === "X";
  const sections = [];

  if (isTwitter) {
    addSection(sections, "SUMMARY", output.summary);
    addSection(sections, "CAPTIONS", uniqueList(output.shortTweet || output.viralCaption || output.improvedPostVersion, output.viralTweet));
    addSection(sections, "THREAD", uniqueList(output.threadVersion), { numbered: true });
    addSection(sections, "HASHTAGS", uniqueList(output.hashtags));
    addSection(sections, "CTA", uniqueList(output.cta, output.ctaSuggestions));
    addSection(sections, "TARGET AUDIENCE", output.targetAudience);
    addSection(sections, "PLATFORM STRATEGY", uniqueList(output.bestPostingStyle, output.engagementStrategy, output.repostStrategy, output.replyPrompt));
    addSection(sections, "TECHNICAL ISSUES", uniqueList(technical.qualityIssues));
    addSection(sections, "IMPROVEMENTS", uniqueList(output.technicalSuggestions, technical.fixSuggestions, technical.recommendedDimensions, technical.recommendedDuration, output.altTextSuggestion), { numbered: true });
    return sections.map(renderSection).join("\n\n");
  }

  addSection(sections, "SUMMARY", uniqueList(output.summary, output.contentScore !== undefined ? `Overall score: ${output.contentScore}/100` : ""));
  addSection(sections, "CAPTIONS", output.viralCaption || output.improvedPostVersion);
  addSection(sections, "HOOKS", uniqueList(output.hookLines));
  addSection(sections, "TITLES", uniqueList(suggestedTitle, alternativeTitles));
  addSection(sections, "HASHTAGS", uniqueList(output.hashtags));
  addSection(sections, "CTA", uniqueList(output.cta, output.ctaSuggestions));
  addSection(sections, "TARGET AUDIENCE", output.targetAudience);
  addSection(sections, "STRENGTHS", uniqueList(engagement.strengths));
  addSection(sections, "WEAKNESSES", uniqueList(engagement.weaknesses));
  addSection(sections, "TECHNICAL ISSUES", uniqueList(technical.qualityIssues));
  addSection(sections, "IMPROVEMENTS", recommendedFixes, { numbered: true });
  addSection(sections, "PLATFORM STRATEGY", platformRecommendation);

  const rewrites = analysis.aiRewriteStudio || {};
  const latestRewrite = rewrites.latestMode ? rewrites[rewrites.latestMode] : null;
  if (latestRewrite?.versions?.length) {
    addSection(
      sections,
      "AI Rewrite Studio",
      latestRewrite.versions.map((item) => item.text)
    );
  }

  return sections.map(renderSection).join("\n\n");
};
