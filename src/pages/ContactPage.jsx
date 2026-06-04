import { Clock3, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Send, Twitter, Youtube } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";
import { useAuth } from "../context/AuthContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { contactService } from "../services/contactService";

const categories = ["General Question", "Technical Issue", "Billing", "Partnership", "Feature Request", "Bug Report"];
const socials = [
  ["Facebook", "https://facebook.com/boostpilotai", Facebook],
  ["Instagram", "https://instagram.com/boostpilotai", Instagram],
  ["LinkedIn", "https://linkedin.com/company/boostpilotai", Linkedin],
  ["Twitter/X", "https://x.com/boostpilotai", Twitter],
  ["YouTube", "https://youtube.com/@boostpilotai", Youtube]
];

const ContactPage = () => {
  const { user } = useAuth();
  usePageMeta({
    title: "Contact BoostPilot AI",
    description: "Contact BoostPilot AI for support, billing, partnerships, feature requests, and bug reports.",
    url: "https://boostpilotai.vercel.app/contact"
  });
  const mapUrl = import.meta.env.VITE_BUSINESS_MAP_URL || "";
  const whatsappUrl = `https://wa.me/${import.meta.env.VITE_BUSINESS_WHATSAPP || "919999999999"}`;
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    category: "General Question",
    message: ""
  });

  const actions = useMemo(
    () => [
      ["WhatsApp", "Chat with support", whatsappUrl, MessageCircle],
      ["Email", "support@boostpilotai.com", "mailto:support@boostpilotai.com", Mail],
      ["Location", mapUrl ? "Open Google Maps" : "Location coming soon", mapUrl || "/contact", MapPin]
    ],
    [mapUrl, whatsappUrl]
  );

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await contactService.send(form);
      setSent(true);
      setForm((current) => ({ ...current, subject: "", message: "" }));
      toast.success("Message sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <PublicNavbar />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Contact</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Talk to BoostPilot AI.</h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-8 text-zinc-700 dark:text-zinc-300">
            Questions about billing, partnerships, bugs, or creator workflows? Send a message and we will route it to the right place.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {actions.map(([title, detail, href, Icon]) => (
              <a className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-700 dark:bg-zinc-900" href={href} key={title} rel="noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-extrabold">{title}</p>
                    <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">{detail}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <Card className="mt-4">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 text-brand-600 dark:text-brand-200" size={20} />
              <div>
                <p className="font-extrabold">Working hours</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map(([label, href, Icon]) => (
                <a className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:text-white" href={href} key={label} rel="noreferrer" target="_blank" aria-label={label}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          {sent && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
              Message submitted. We will review it soon.
            </div>
          )}
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" onChange={(event) => update("name", event.target.value)} required value={form.name} />
              <Input label="Email" onChange={(event) => update("email", event.target.value)} required type="email" value={form.email} />
            </div>
            <Input label="Subject" onChange={(event) => update("subject", event.target.value)} placeholder="What can we help with?" required value={form.subject} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Category</span>
              <select className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => update("category", event.target.value)} value={form.category}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">Message</span>
              <textarea className="min-h-40 w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => update("message", event.target.value)} placeholder="Share details, links, or account context." required value={form.message} />
            </label>
            <Button className="w-full sm:w-auto" icon={Send} loading={loading} size="lg" type="submit" variant="accent">
              Submit message
            </Button>
          </form>
        </Card>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8" id="location">
        <Card className="grid min-h-64 place-items-center overflow-hidden text-center">
          {mapUrl ? (
            <iframe className="h-80 w-full rounded-lg border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapUrl} title="BoostPilot AI location" />
          ) : (
            <div>
              <MapPin className="mx-auto text-brand-600 dark:text-brand-200" size={34} />
              <h2 className="mt-4 text-2xl font-extrabold">Location coming soon</h2>
              <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Add VITE_BUSINESS_MAP_URL to show an embedded Google Map.</p>
            </div>
          )}
        </Card>
      </section>
      <PublicFooter />
    </main>
  );
};

export default ContactPage;
