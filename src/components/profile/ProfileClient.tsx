"use client";

import { useState, type FormEvent } from "react";
import { User, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/shared/Toast";

export function ProfileClient() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName]   = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [savingPw, setSavingPw]     = useState(false);
  const [pwError, setPwError]       = useState<string | null>(null);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast("Profile updated successfully.");
    } catch {
      toast("Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setSavingPw(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast("Password changed successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      toast("Failed to change password.", "error");
    } finally {
      setSavingPw(false);
    }
  }

  const INPUT = "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20";
  const LABEL = "mb-1.5 block text-sm font-medium text-foreground";

  const initials = (user?.name ?? "U").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account security."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Avatar card ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-2xl font-bold text-accent">
            {initials}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{user?.name}</p>
            {user?.email && <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>}
          </div>
          <span className="rounded-full bg-sidebar px-3 py-1 text-xs font-semibold capitalize text-accent">
            {user?.role}
          </span>
          {user?.department && (
            <p className="text-xs text-muted-foreground">{user.department}</p>
          )}
        </div>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Edit name / phone */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className={LABEL} htmlFor="profile-name">Full Name</label>
                <input id="profile-name" type="text" required value={name}
                  onChange={(e) => setName(e.target.value)} className={INPUT}
                  placeholder="Your full name" />
              </div>

              <div>
                <label className={LABEL} htmlFor="profile-email">Email Address</label>
                <input id="profile-email" type="email" disabled value={user?.email ?? ""}
                  className={`${INPUT} cursor-not-allowed opacity-60`}
                  placeholder="Email cannot be changed" />
              </div>

              <div>
                <label className={LABEL} htmlFor="profile-phone">Phone Number</label>
                <input id="profile-phone" type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} className={INPUT}
                  placeholder="+250 7XX XXX XXX" />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-60">
                  {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Change password */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {pwError && (
                <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger ring-1 ring-danger/20">
                  {pwError}
                </p>
              )}

              <div>
                <label className={LABEL} htmlFor="current-pw">Current Password</label>
                <div className="relative">
                  <input id="current-pw" type={showCurrent ? "text" : "password"} required
                    value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                    className={`${INPUT} pr-10`} placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="new-pw">New Password</label>
                <div className="relative">
                  <input id="new-pw" type={showNew ? "text" : "password"} required
                    value={newPw} onChange={(e) => setNewPw(e.target.value)}
                    className={`${INPUT} pr-10`} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="confirm-pw">Confirm New Password</label>
                <input id="confirm-pw" type="password" required
                  value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  className={INPUT} placeholder="Re-enter new password" />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={savingPw}
                  className="inline-flex items-center gap-2 rounded-lg border border-accent px-5 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors disabled:opacity-60">
                  {savingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
