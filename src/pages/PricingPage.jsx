import { CheckCircle2, Copy, CreditCard, Lock, Mail, QrCode, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { billingService } from "../services/billingService";
import { creditsForPlan, featuresForPlan, hasPlan, plans, priceForPlan } from "../utils/plans";

const defaultSettings = {
  upiId: "boostpilot@upi",
  barcodeImageUrl: "",
  qrImageUrl: "",
  hasQrImage: false,
  paymentEmail: "boostpilot@ai.in",
  paymentMessage:
    "After completing payment, send your payment number, UTR, or transaction number to boostpilot@ai.in."
};

const comparisonRows = [
  { label: "Basic AI analysis", plan: "free" },
  { label: "Basic captions/hooks", plan: "free" },
  { label: "Standard report", plan: "free" },
  { label: "AI Rewrite Studio", plan: "creator" },
  { label: "Content Library", plan: "creator" },
  { label: "No watermark", plan: "creator" },
  { label: "Trend Finder", plan: "pro" },
  { label: "Growth Coach", plan: "pro" },
  { label: "Advanced platform strategy", plan: "pro" },
  { label: "Admin/team-ready controls", plan: "agency" },
  { label: "Priority AI processing", plan: "agency" },
  { label: "Future team workspace/API access", plan: "agency" }
];

const PaymentModal = ({ billingCycle, onClose, plan, qrSrc, settings }) => {
  const amount = priceForPlan(plan, billingCycle);
  const credits = creditsForPlan(plan, billingCycle);
  const details = settings || defaultSettings;
  const displayQrSrc = qrSrc || details.barcodeImageUrl;

  const copyText = `${plan.name} ${billingCycle} payment\nAmount: ${amount}\nUPI: ${details.upiId}\nSend payment number / UTR / transaction number to ${details.paymentEmail}`;

  const copyDetails = async () => {
    await navigator.clipboard.writeText(copyText);
    toast.success("Payment details copied");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/65 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="flex min-h-full items-center justify-center">
        <Card className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto p-0">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Badge className="bg-white/10 text-white ring-white/15" variant="neutral">
                  Payment request
                </Badge>
                <h2 className="mt-5 break-words text-3xl font-extrabold tracking-tight">{plan.name} plan</h2>
                <p className="mt-2 text-sm font-medium capitalize text-zinc-200">{billingCycle} billing</p>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-7 rounded-lg border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-medium text-zinc-200">Amount</p>
              <p className="mt-2 text-4xl font-extrabold">{amount}</p>
              <p className="mt-2 text-sm font-medium text-zinc-200">{credits} analysis credits</p>
            </div>
            <p className="mt-5 text-sm font-medium leading-6 text-zinc-200">
              Your plan will not activate automatically. Admin will update your plan and credits after payment
              verification.
            </p>
          </div>

          <div className="min-w-0 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="grid min-h-44 place-items-center rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                {displayQrSrc ? (
                  <img
                    alt="Payment barcode"
                    className="max-h-40 max-w-full rounded-md object-contain"
                    src={displayQrSrc}
                  />
                ) : (
                  <div className="grid h-36 w-36 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
                    <QrCode size={42} />
                    Add barcode in admin
                  </div>
                )}
              </div>
              <div className="min-w-0 space-y-3">
                <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-700 dark:!text-zinc-300">UPI ID</p>
                  <p className="mt-2 break-all text-lg font-extrabold text-zinc-950 [overflow-wrap:anywhere] dark:!text-white">
                    {details.upiId}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-700 dark:!text-zinc-300">Send proof to</p>
                  <p className="mt-2 break-all font-extrabold text-zinc-950 [overflow-wrap:anywhere] dark:!text-white">
                    {details.paymentEmail}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 break-words rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 [overflow-wrap:anywhere] dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100">
              {details.paymentMessage}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" icon={Copy} onClick={copyDetails} variant="secondary">
                Copy payment details
              </Button>
              <Button as="a" className="flex-1" href={`mailto:${details.paymentEmail}`} icon={Mail} variant="accent">
                Email payment proof
              </Button>
            </div>
          </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [qrObjectUrl, setQrObjectUrl] = useState("");
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    billingService
      .settings()
      .then((data) => setSettings({ ...defaultSettings, ...(data.settings || {}) }))
      .catch(() => setSettings(defaultSettings));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    if (!settings.hasQrImage) {
      setQrObjectUrl("");
      return undefined;
    }

    billingService
      .qrBlob()
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setQrObjectUrl(objectUrl);
      })
      .catch(() => setQrObjectUrl(""));

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [settings.hasQrImage, settings.updatedAt]);

  const handleUpgrade = async (plan) => {
    setLoadingPlan(plan.name);

    try {
      const data = await billingService.requestUpgrade({ plan: plan.id, billingCycle });
      setSettings({ ...defaultSettings, ...(data.settings || settings) });
      setSelectedPlan(plan);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load payment details");
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={
          <div className="inline-flex rounded-lg border border-zinc-300 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {["monthly", "yearly"].map((cycle) => (
              <button
                className={`rounded-md px-4 py-2 text-sm font-bold capitalize transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:focus-visible:ring-brand-400/25 ${
                  billingCycle === cycle
                    ? "bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-white dark:ring-1 dark:ring-brand-300/40"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                type="button"
              >
                {cycle}
              </button>
            ))}
          </div>
        }
        description="Choose a plan, pay through UPI/barcode, then send the UTR or transaction number for admin activation."
        eyebrow="Pricing"
        title="Choose your BoostPilot plan"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = user?.plan === plan.id && (user?.billingCycle || "monthly") === billingCycle;
          const isFree = plan.id === "free";
          const visibleFeatures = featuresForPlan(plan.id).slice(0, plan.id === "free" ? 6 : 7);

          return (
            <Card
              className={plan.recommended ? "border-brand-300 shadow-glow dark:border-brand-700" : isCurrent ? "border-emerald-300 dark:border-emerald-700" : ""}
              key={plan.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-zinc-950 dark:text-white">{plan.name}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {priceForPlan(plan, billingCycle)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {plan.badge && <Badge variant={plan.recommended ? "brand" : "warning"}>{plan.badge}</Badge>}
                  {isCurrent && <Badge variant="success">Current</Badge>}
                </div>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">{plan.audience}</p>
              <div className="mt-5 rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white">
                <div className="flex items-center gap-2 font-bold text-zinc-950 dark:!text-white">
                  <CreditCard size={18} />
                  {creditsForPlan(plan, billingCycle)} analyses/{billingCycle === "yearly" ? "year" : "month"}
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                {visibleFeatures.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <CheckCircle2 className="mt-0.5 text-emerald-500" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {plan.id !== "agency" && (
                <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/90 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-300">
                  <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100">
                    <Lock size={15} />
                    Next unlock
                  </div>
                  <p className="mt-1 leading-6">
                    {plan.id === "free"
                      ? "Creator unlocks AI Rewrite Studio and Content Library."
                      : plan.id === "creator"
                        ? "Pro unlocks Trend Finder, Growth Coach, and advanced strategy."
                        : "Agency unlocks admin-ready controls, higher limits, and premium reports."}
                  </p>
                </div>
              )}
              <Button
                className="mt-6 w-full"
                disabled={isCurrent || isFree}
                icon={Sparkles}
                loading={loadingPlan === plan.name}
                onClick={() => handleUpgrade(plan)}
                variant={isCurrent || isFree ? "secondary" : "accent"}
              >
                {isCurrent ? "Active plan" : isFree ? "Free included" : "View payment details"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-0">
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white">Feature matrix</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Compare locked premium actions and reporting upgrades across all four plans.
              </p>
            </div>
            <Badge variant="brand">4 plans</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <tr>
                <th className="px-4 py-3">Feature</th>
                {plans.map((plan) => (
                  <th className="px-4 py-3 text-center" key={plan.id}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr className="border-t border-zinc-200 dark:border-zinc-800" key={row.label}>
                  <td className="px-4 py-3 font-semibold text-zinc-950 dark:text-white">{row.label}</td>
                  {plans.map((plan) => {
                    const included = hasPlan(plan.id, row.plan);

                    return (
                      <td className="px-4 py-3 text-center" key={`${row.label}-${plan.id}`}>
                        {included ? (
                          <CheckCircle2 className="mx-auto text-emerald-500" size={18} />
                        ) : (
                          <Lock className="mx-auto text-zinc-400 dark:text-zinc-600" size={16} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedPlan && (
        <PaymentModal
          billingCycle={billingCycle}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
          qrSrc={qrObjectUrl}
          settings={settings}
        />
      )}
    </motion.div>
  );
};

export default PricingPage;
