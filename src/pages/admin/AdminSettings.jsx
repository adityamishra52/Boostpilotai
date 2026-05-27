import { KeyRound, QrCode, Save, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PageHeader from "../../components/PageHeader";
import SectionContainer from "../../components/SectionContainer";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import { authService } from "../../services/authService";
import { billingService } from "../../services/billingService";

const defaultBilling = {
  upiId: "boostpilot@upi",
  barcodeImageUrl: "",
  qrImageUrl: "",
  hasQrImage: false,
  paymentEmail: "boostpilot@ai.in",
  paymentMessage:
    "After completing payment, send your payment number, UTR, or transaction number to boostpilot@ai.in."
};

const qrTypes = ["image/jpeg", "image/png", "image/webp"];

const AdminSettings = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState(defaultBilling);
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrObjectUrl, setQrObjectUrl] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    billingService
      .settings()
      .then((data) => setBilling({ ...defaultBilling, ...(data.settings || {}) }))
      .catch(() => setBilling(defaultBilling));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    if (!billing.hasQrImage) {
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
  }, [billing.hasQrImage, billing.updatedAt]);

  const updateField = (key, value) => {
    setBilling((current) => ({ ...current, [key]: value }));
  };

  const updatePasswordField = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const data = await adminService.updateBilling({
        upiId: billing.upiId,
        barcodeImageUrl: billing.hasQrImage ? "" : billing.barcodeImageUrl,
        paymentEmail: billing.paymentEmail,
        paymentMessage: billing.paymentMessage
      });
      setBilling({ ...defaultBilling, ...data.settings });
      toast.success("Payment settings updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save payment settings");
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!qrTypes.includes(file.type)) {
      toast.error("Upload a PNG, JPG, or WebP QR image");
      event.target.value = "";
      return;
    }

    setQrLoading(true);

    try {
      const data = await adminService.uploadBillingQr(file);
      setBilling({ ...defaultBilling, ...data.settings });
      toast.success("QR image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload QR image");
    } finally {
      setQrLoading(false);
      event.target.value = "";
    }
  };

  const handleDeleteQr = async () => {
    setQrLoading(true);

    try {
      const data = await adminService.deleteBillingQr();
      setBilling({ ...defaultBilling, ...data.settings });
      toast.success("QR image deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete QR image");
    } finally {
      setQrLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Admin password changed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change admin password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const previewSrc = qrObjectUrl || (!billing.hasQrImage ? billing.barcodeImageUrl : "");

  return (
    <div>
      <PageHeader
        action={<Badge variant="success">MongoDB binary QR</Badge>}
        description="Control payment instructions, QR upload, and admin account security."
        eyebrow="Admin"
        title="Admin settings"
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionContainer
          action={
            <Button icon={Save} loading={loading} onClick={handleSave} variant="accent">
              Save payment settings
            </Button>
          }
          icon={QrCode}
          title="Payment instructions"
        >
          <div className="grid gap-4">
            <Input
              label="UPI ID"
              onChange={(event) => updateField("upiId", event.target.value)}
              placeholder="yourupi@bank"
              value={billing.upiId}
            />
            <Input
              disabled={billing.hasQrImage}
              label="Fallback QR image URL"
              onChange={(event) => updateField("barcodeImageUrl", event.target.value)}
              placeholder="https://... or data:image/png;base64,..."
              value={billing.hasQrImage ? "" : billing.barcodeImageUrl}
            />
            <Input
              label="Payment proof email"
              onChange={(event) => updateField("paymentEmail", event.target.value)}
              placeholder="boostpilot@ai.in"
              type="email"
              value={billing.paymentEmail}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Payment message
              </span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-zinc-200 bg-white/86 px-4 py-3 text-sm leading-6 text-zinc-950 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-zinc-800 dark:bg-zinc-950/72 dark:text-white dark:focus:ring-brand-900/30"
                onChange={(event) => updateField("paymentMessage", event.target.value)}
                value={billing.paymentMessage}
              />
            </label>
          </div>
        </SectionContainer>

        <div className="space-y-5">
          <SectionContainer icon={QrCode} title="Payment QR">
            <div className="grid place-items-center rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              {previewSrc ? (
                <img
                  alt="Payment QR preview"
                  className="max-h-56 max-w-full rounded-md object-contain"
                  src={previewSrc}
                />
              ) : (
                <div className="grid h-48 w-48 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
                  <QrCode size={52} />
                  QR preview
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                id="billing-qr-upload"
                onChange={handleQrUpload}
                type="file"
              />
              <Button
                as="label"
                className="flex-1 cursor-pointer"
                htmlFor="billing-qr-upload"
                icon={UploadCloud}
                variant="secondary"
              >
                {qrLoading ? "Uploading..." : "Upload QR"}
              </Button>
              <Button
                className="flex-1"
                disabled={!billing.hasQrImage || qrLoading}
                icon={Trash2}
                onClick={handleDeleteQr}
                variant="danger"
              >
                Delete QR
              </Button>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">UPI</p>
              <p className="mt-2 break-all font-extrabold text-zinc-950 [overflow-wrap:anywhere] dark:text-white">
                {billing.upiId}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Payment proof email
              </p>
              <p className="mt-2 break-all font-extrabold text-zinc-950 [overflow-wrap:anywhere] dark:text-white">
                {billing.paymentEmail}
              </p>
            </div>
          </SectionContainer>

          <SectionContainer icon={KeyRound} title="Admin password">
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="rounded-lg border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Signed in admin</p>
                <p className="mt-2 break-all font-extrabold text-zinc-950 dark:text-white">{user?.email}</p>
              </div>
              <Input
                autoComplete="current-password"
                label="Current password"
                onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
                required
                type="password"
                value={passwordForm.currentPassword}
              />
              <Input
                autoComplete="new-password"
                label="New password"
                minLength={6}
                onChange={(event) => updatePasswordField("newPassword", event.target.value)}
                required
                type="password"
                value={passwordForm.newPassword}
              />
              <Input
                autoComplete="new-password"
                label="Confirm new password"
                minLength={6}
                onChange={(event) => updatePasswordField("confirmPassword", event.target.value)}
                required
                type="password"
                value={passwordForm.confirmPassword}
              />
              <Button className="w-full" icon={KeyRound} loading={passwordLoading} type="submit" variant="secondary">
                Change admin password
              </Button>
            </form>
          </SectionContainer>

          <SectionContainer icon={ShieldCheck} title="Access rules">
            <ul className="space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <li>Users can request payment details; admins activate plans after verification.</li>
              <li>Admins can update plan, billing cycle, credits, and temporary passwords.</li>
              <li>Blocked users cannot log in or run analysis requests.</li>
              <li>Normal users never see admin navigation or controls.</li>
            </ul>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
