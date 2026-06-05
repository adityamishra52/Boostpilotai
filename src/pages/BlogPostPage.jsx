import { BarChart3, CheckCircle2, Hash, MessageCircle, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";

const sections = [
  ["Start with platform fit", "A good post for LinkedIn may need different hooks, pacing, and hashtags than a YouTube Short or Instagram Reel.", BarChart3],
  ["Generate reusable copy", "Captions, hooks, title ideas, CTAs, and hashtag sets should be stored so your best ideas can be reused.", MessageCircle],
  ["Check media quality", "Brightness, clarity, aspect ratio, safe spacing, and readability all influence how content performs on mobile.", Sparkles],
  ["Measure search intent", "Creator content should answer what the audience is searching, saving, sharing, or comparing.", Search],
  ["Use hashtags carefully", "Relevant hashtags help classification, but platform-specific context and strong copy matter more than volume.", Hash]
];

const BlogPostPage = () => (
  <main className="min-h-dvh bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
    <PublicNavbar />
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Creator SEO Guide</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        How to optimize social media content with AI without losing your voice
      </h1>
      <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
        AI content optimization works best when it improves the decisions around your post: platform fit, hooks, captions, hashtags, media quality, and reusable content systems.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button as={Link} to="/analyze" variant="accent">Analyze content</Button>
        <Button as={Link} to="/features" variant="secondary">See features</Button>
      </div>

      <div className="mt-8 grid gap-4">
        {sections.map(([title, text, Icon]) => (
          <Card className="p-5" key={title}>
            <div className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5 p-5">
        <h2 className="text-2xl font-extrabold">A practical AI optimization checklist</h2>
        <div className="mt-4 grid gap-3">
          {[
            "Upload the original image or video before writing the final caption.",
            "Choose the platform and content format first.",
            "Review hooks, captions, hashtags, quality issues, and platform-specific suggestions together.",
            "Save the strongest copy to a reusable content library.",
            "Export reports when you need client, team, or archive documentation."
          ].map((item) => (
            <div className="flex gap-3 text-sm font-semibold leading-6 text-zinc-700 dark:text-zinc-300" key={item}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={17} />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </article>
    <PublicFooter />
  </main>
);

export default BlogPostPage;
