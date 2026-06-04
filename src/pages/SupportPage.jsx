import { AlertCircle, CheckCircle2, Clock3, LifeBuoy, Paperclip, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { supportService } from "../services/supportService";

const categories = ["Technical Issue", "Billing", "Feature Request", "Bug Report", "Account Problem", "General Question"];
const priorities = ["Low", "Normal", "High", "Urgent"];

const SupportPage = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    category: "Technical Issue",
    priority: "Normal",
    message: "",
    attachment: null
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await supportService.createTicket(form);
      setSubmitted(true);
      toast.success("Support ticket submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit support ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        description="Send account, billing, product, or bug questions to the BoostPilot team."
        eyebrow="Support"
        title="Contact BoostPilot support"
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-0">
          {submitted ? (
            <div className="grid min-h-[520px] place-items-center p-6 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-zinc-950 dark:text-white">Ticket received</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  We saved your request. Priority support is reviewed first for Agency workspaces.
                </p>
                <Button className="mt-6" onClick={() => setSubmitted(false)} variant="secondary">
                  Submit another request
                </Button>
              </div>
            </div>
          ) : (
            <form className="grid gap-4 p-5 sm:p-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" onChange={(event) => update("name", event.target.value)} placeholder="Your name" required value={form.name} />
                <Input label="Email" onChange={(event) => update("email", event.target.value)} placeholder="you@company.com" required type="email" value={form.email} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Category</span>
                  <select className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => update("category", event.target.value)} value={form.category}>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Priority</span>
                  <select className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => update("priority", event.target.value)} value={form.priority}>
                    {priorities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Message</span>
                <textarea
                  className="min-h-36 w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400"
                  onChange={(event) => update("message", event.target.value)}
                  placeholder="Tell us what happened, what you expected, and any report URL or screenshot link."
                  required
                  value={form.message}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Optional attachment</span>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/70">
                  <Paperclip size={18} className="text-zinc-500" />
                  <input
                    className="w-full text-sm font-medium text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white dark:text-zinc-300 dark:file:bg-white dark:file:text-zinc-950"
                    onChange={(event) => update("attachment", event.target.files?.[0] || null)}
                    type="file"
                  />
                </div>
              </label>
              <Button className="w-full sm:w-auto" icon={Send} loading={loading} size="lg" type="submit" variant="accent">
                Submit support request
              </Button>
            </form>
          )}
        </Card>

        <div className="grid gap-5">
          <SectionContainer icon={ShieldCheck} title="Trust and privacy" description="Built for creators who want control.">
            <div className="grid gap-3">
              {["Secure login", "Private uploads", "No social posting without permission"].map((item) => (
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-100" key={item}>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </SectionContainer>
          <SectionContainer icon={Clock3} title="Agency priority support" description="Agency workspaces move to the front of the review queue.">
            <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm font-semibold leading-6 text-brand-900 dark:border-brand-400/25 dark:bg-brand-400/10 dark:text-brand-100">
              Choose High or Urgent priority for production-blocking issues, billing activation, or launch-day report exports.
            </div>
          </SectionContainer>
          <SectionContainer icon={AlertCircle} title="Before submitting" description="A few details help us fix it faster.">
            <ul className="grid gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <li>Include the page URL and browser.</li>
              <li>Attach a screenshot name or paste a public link in the message.</li>
              <li>For billing, mention the plan and payment reference.</li>
            </ul>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
