import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";
import { usePageMeta } from "../hooks/usePageMeta";

const copy = {
  privacy: {
    title: "Privacy Policy",
    description: "BoostPilot AI keeps uploads private, protects account access, and does not post to social platforms without permission."
  },
  terms: {
    title: "Terms",
    description: "Use BoostPilot AI responsibly for creator workflows, reports, saved content, and AI-assisted suggestions."
  }
};

const LegalPage = ({ type }) => {
  const page = copy[type] || copy.privacy;
  usePageMeta({
    title: `${page.title} - BoostPilot AI`,
    description: page.description,
    url: `https://boostpilotai.vercel.app/${type}`
  });

  return (
    <main className="min-h-dvh bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <PublicNavbar />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-700 dark:bg-zinc-900 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Company</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{page.title}</h1>
          <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">{page.description}</p>
          <div className="mt-6 grid gap-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            <p>This page is a concise product policy placeholder. Replace it with final legal copy before broad production launch.</p>
            <p>For questions, contact support@boostpilotai.com or use the Contact page.</p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
};

export default LegalPage;
