import { Bug, CheckCircle2, Lightbulb, MessageSquare, Rocket, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PageHeader from "../components/PageHeader";
import { supportService } from "../services/supportService";

const types = [
  ["Feature Request", "Ask for a new workflow, integration, or report output.", Rocket],
  ["Bug Report", "Tell us what broke and how to reproduce it.", Bug],
  ["Improvement Idea", "Suggest a polish pass that would make the product easier.", Lightbulb]
];

const FeedbackPage = () => {
  const [form, setForm] = useState({ type: "Feature Request", title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submittedType, setSubmittedType] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await supportService.createFeedback(form);
      setSubmittedType(form.type);
      setForm((current) => ({ ...current, title: "", message: "" }));
      toast.success("Feedback submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        description="Request features, report bugs, and suggest improvements that make BoostPilot easier for creators."
        eyebrow="Feedback"
        title="Help shape BoostPilot AI"
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {types.map(([title, text, Icon]) => (
            <button
              className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${
                form.type === title
                  ? "border-brand-300 bg-brand-50 shadow-soft dark:border-brand-400/40 dark:bg-brand-400/10"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
              }`}
              key={title}
              onClick={() => update("type", title)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-zinc-950 dark:text-white">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
                </div>
              </div>
            </button>
          ))}
          <Card className="!bg-zinc-950 text-white dark:!bg-zinc-900">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-1 text-brand-200" size={20} />
              <div>
                <p className="font-extrabold">Creator feedback loop</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  We review requests by impact, clarity, and how well they support repeat content workflows.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          {submittedType && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
              <CheckCircle2 size={18} />
              {submittedType} submitted.
            </div>
          )}
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Feedback type</span>
              <select className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => update("type", event.target.value)} value={form.type}>
                {types.map(([title]) => <option key={title}>{title}</option>)}
              </select>
            </label>
            <Input label="Title" onChange={(event) => update("title", event.target.value)} placeholder="Short summary" required value={form.title} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Details</span>
              <textarea
                className="min-h-44 w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400"
                onChange={(event) => update("message", event.target.value)}
                placeholder="What should change, who needs it, and what outcome would it improve?"
                required
                value={form.message}
              />
            </label>
            <Button className="w-full sm:w-auto" icon={Send} loading={loading} size="lg" type="submit" variant="accent">
              Submit feedback
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
