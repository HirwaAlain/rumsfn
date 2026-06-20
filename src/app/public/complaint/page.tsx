"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { ShieldCheck, Copy, Check, AlertCircle, RotateCcw } from "lucide-react";

const SECTORS = ["Telecom", "Energy", "Water", "Transport"] as const;
const PROVINCES = [
  "Kigali City",
  "Northern Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
] as const;
const CATEGORIES = [
  "Billing Dispute",
  "Service Interruption",
  "Poor Quality of Service",
  "Unauthorized Charges",
  "Contract Violation",
  "Customer Service Failure",
  "Data Privacy Breach",
  "Tariff Overcharge",
  "Connection Delay",
  "Other",
] as const;
interface FormState {
  fullName: string;
  phone: string;
  operator: string;
  sector: string;
  province: string;
  category: string;
  subject: string;
  description: string;
}

const EMPTY: FormState = {
  fullName: "", phone: "", operator: "", sector: "", province: "",
  category: "", subject: "", description: "",
};

interface SuccessData {
  referenceNumber: string;
  id: string;
  message: string;
}

const INPUT = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#00C2CB]/50 focus:ring-2 focus:ring-[#00C2CB]/20";
const SELECT = `${INPUT} appearance-none cursor-pointer`;
const LABEL = "mb-1.5 block text-sm font-medium text-slate-300";

export default function PublicComplaintPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);

  function update(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/complaints/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string; message?: string };
        throw new Error(body.error ?? body.message ?? "Submission failed");
      }
      const data = (await res.json()) as SuccessData;
      setSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyRef() {
    if (!success) return;
    await navigator.clipboard.writeText(success.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setForm(EMPTY);
    setSuccess(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] px-4 py-12">
      <div className="mx-auto max-w-xl">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00C2CB]/10 ring-1 ring-[#00C2CB]/30">
            <ShieldCheck className="h-7 w-7 text-[#00C2CB]" />
          </div>
          <h1 className="text-2xl font-bold text-white">File a Complaint</h1>
          <p className="mt-1 text-sm text-slate-400">
            Rwanda Utilities Regulatory Authority — Public Portal
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Submit your complaint against a licensed utility operator. No account required.
          </p>
        </div>

        {/* ── Success card ───────────────────────────────────────── */}
        {success && (
          <div className="rounded-2xl border border-[#00C2CB]/20 bg-[#112240] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#00C2CB]/10">
              <Check className="h-7 w-7 text-[#00C2CB]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Complaint Submitted</h2>
            <p className="mt-2 text-sm text-slate-400">{success.message}</p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Your Reference Number
              </p>
              <div className="flex items-center justify-center gap-3 rounded-lg bg-white/5 px-4 py-3">
                <code className="font-mono text-base font-semibold text-[#00C2CB]">
                  {success.referenceNumber}
                </code>
                <button
                  type="button"
                  onClick={copyRef}
                  aria-label="Copy reference number"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-4 w-4 text-[#00C2CB]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Save this number to track the status of your complaint.
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              File Another Complaint
            </button>
          </div>
        )}

        {/* ── Form ───────────────────────────────────────────────── */}
        {!success && (
          <div className="rounded-2xl border border-white/10 bg-[#112240] p-8 shadow-2xl">

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className={LABEL} htmlFor="pc-name">
                  Your Full Name <span className="text-red-400">*</span>
                </label>
                <input id="pc-name" type="text" required value={form.fullName}
                  onChange={update("fullName")} className={INPUT}
                  placeholder="Enter your full name" />
              </div>

              {/* Phone */}
              <div>
                <label className={LABEL} htmlFor="pc-phone">Phone Number</label>
                <input id="pc-phone" type="tel" value={form.phone}
                  onChange={update("phone")} className={INPUT}
                  placeholder="+250 7XX XXX XXX (optional)" />
              </div>

              {/* Operator */}
              <div>
                <label className={LABEL} htmlFor="pc-operator">
                  Operator / Company <span className="text-red-400">*</span>
                </label>
                <input id="pc-operator" type="text" required value={form.operator}
                  onChange={update("operator")} className={INPUT}
                  placeholder="e.g. MTN Rwanda, REG, WASAC" />
              </div>

              {/* Sector + Province */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="pc-sector">
                    Sector <span className="text-red-400">*</span>
                  </label>
                  <select id="pc-sector" required value={form.sector}
                    onChange={update("sector")} className={SELECT}>
                    <option value="">Select sector</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL} htmlFor="pc-province">
                    Province <span className="text-red-400">*</span>
                  </label>
                  <select id="pc-province" required value={form.province}
                    onChange={update("province")} className={SELECT}>
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={LABEL} htmlFor="pc-category">
                  Complaint Category <span className="text-red-400">*</span>
                </label>
                <select id="pc-category" required value={form.category}
                  onChange={update("category")} className={SELECT}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300" htmlFor="pc-subject">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {form.subject.length}/300
                  </span>
                </div>
                <input id="pc-subject" type="text" required maxLength={300}
                  value={form.subject} onChange={update("subject")} className={INPUT}
                  placeholder="Brief summary of your complaint" />
              </div>

              {/* Description */}
              <div>
                <label className={LABEL} htmlFor="pc-description">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea id="pc-description" required rows={6} minLength={20}
                  value={form.description} onChange={update("description")}
                  className={`${INPUT} resize-none`}
                  placeholder="Describe your complaint in detail (minimum 20 characters)…" />
                {form.description.length > 0 && form.description.length < 20 && (
                  <p className="mt-1 text-xs text-red-400">
                    Description must be at least 20 characters ({20 - form.description.length} more needed).
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00C2CB] px-4 py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#00C2CB]/90 focus:outline-none focus:ring-2 focus:ring-[#00C2CB]/50 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </span>
                ) : "Submit Complaint"}
              </button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-600">
          RUMS v1.0 · For authorized RURA personnel only ·{" "}
          <a href="/login" className="text-slate-500 hover:text-slate-400 transition-colors">
            Staff Login
          </a>
        </p>
      </div>
    </div>
  );
}
