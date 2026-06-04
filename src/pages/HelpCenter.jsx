import { BookOpen, CheckCircle2, CreditCard, Library, LifeBuoy, Search, ShieldCheck, Sparkles, TrendingUp, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";

const guides = [
  ["Getting started", "Upload a post, choose a platform and content type, then run your first analysis."],
  ["How to use BoostPilot AI", "Use Results for captions, hooks, titles, hashtags, rewrites, media suggestions, and exports."],
  ["Credits", "Credits are used when you generate a new analysis or premium AI workflow. Plan upgrades add more monthly capacity."],
  ["Plans", "Creator unlocks reusable content tools, Pro adds advanced workflows, and Agency adds priority support and team-ready limits."]
];

const topics = [
  ["Google login help", "If Google sign-in fails, use the same Google account again, allow the popup, or continue with email.", ShieldCheck],
  ["Content Library help", "Save captions, hooks, titles, rewrites, Trend Finder reports, and Growth Coach plans for reuse.", Library],
  ["Trend Finder help", "Generate platform-specific trend ideas and save the best report to your library.", TrendingUp],
  ["Growth Coach help", "Create growth plans from your creator goals and keep them for later execution.", WandSparkles],
  ["AI Rewrite help", "Rewrite existing content by tone, platform, or format without changing your source workflow.", Sparkles],
  ["Export report help", "Download a PDF or copy report sections directly from the results page.", BookOpen]
];

const faqs = [
  ["How do I start an analysis?", "Open Analyze, upload an image or video, choose the platform and post type, then select Get report."],
  ["Why do credits decrease?", "Credits are consumed by new analyses and premium AI generation tasks so usage stays predictable."],
  ["Can BoostPilot post to my social accounts?", "No. BoostPilot does not post to social platforms without your permission."],
  ["Where is saved content stored?", "Saved captions, hooks, hashtags, rewrites, coach plans, and trends appear in Content Library."],
  ["Can I reuse old saved content?", "Yes. Open Content Library, search or filter an item, then use Reuse to start from that content."],
  ["How do I get billing help?", "Use Contact Support and choose Billing so the admin team can review your account."],
  ["What if Google login shows the wrong account?", "Sign out of that Google session in your browser or choose a different Google account from the Google prompt."],
  ["How do I report a bug?", "Use Report Bug from the floating help widget or open Feedback and select Bug Report."]
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredFaqs = useMemo(
    () =>
      faqs.filter(([question, answer]) =>
        `${question} ${answer}`.toLowerCase().includes(normalizedQuery)
      ),
    [normalizedQuery]
  );

  return (
    <div>
      <PageHeader
        action={
          <Button as={Link} icon={LifeBuoy} to="/support" variant="accent">
            Contact support
          </Button>
        }
        description="Search guides, learn core workflows, and understand credits, plans, reports, and reusable content."
        eyebrow="Help Center"
        title="Get more from BoostPilot AI"
      />

      <Card className="mb-5 overflow-hidden !bg-zinc-950 p-0 text-white dark:!bg-zinc-900">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div>
            <Badge className="bg-white/10 text-white ring-white/15" variant="neutral">
              <ShieldCheck size={13} />
              Secure creator workspace
            </Badge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Answers before you need a ticket.</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-300">
              Learn the fastest path from upload to report, save strong outputs, and understand which plan fits your workflow.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/60 px-4 py-3">
              <Search size={19} className="text-brand-200" />
              <input
                className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-zinc-400"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search FAQ, credits, Google login..."
                value={query}
              />
            </div>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-zinc-200">
              {["Private uploads", "No social posting without permission", "Agency priority support"].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <CheckCircle2 size={16} className="text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionContainer icon={BookOpen} title="Getting started guide" description="A practical path through the product.">
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map(([title, text]) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={title}>
                <h3 className="font-extrabold text-zinc-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
              </div>
            ))}
          </div>
        </SectionContainer>

        <SectionContainer icon={Search} title="Search FAQ" description="Filtered as you type.">
          <div className="grid gap-3">
            {(filteredFaqs.length ? filteredFaqs : faqs).map(([question, answer]) => (
              <details className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={question}>
                <summary className="cursor-pointer font-extrabold text-zinc-950 dark:text-white">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{answer}</p>
              </details>
            ))}
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="mt-5" icon={CreditCard} title="Product help topics" description="Quick explanations for the workflows creators use most.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topics.map(([title, text, Icon]) => (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/70" key={title}>
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
                <Icon size={18} />
              </div>
              <h3 className="font-extrabold text-zinc-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default HelpCenter;
