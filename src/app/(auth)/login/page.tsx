"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { RumsLogoIcon } from "@/components/shared/RumsLogoIcon";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const ROLE_REDIRECTS: Record<string, string> = {
    admin:      "/admin/dashboard",
    supervisor: "/supervisor/dashboard",
    analyst:    "/analyst/dashboard",
    auditor:    "/auditor/dashboard",
    viewer:     "/viewer/dashboard",
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const stored = document.cookie.match(/(?:^|;\s*)rums_user=([^;]+)/);
      if (stored) {
        try {
          const u = JSON.parse(decodeURIComponent(stored[1])) as { role: string };
          const dest = ROLE_REDIRECTS[u.role] ?? "/";
          router.replace(dest);
          return;
        } catch { /* fall through */ }
      }
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo / branding */}
      <div className="text-center">
        <RumsLogoIcon className="mx-auto mb-4 h-14 w-14" />
        <h1 className="text-2xl font-bold tracking-tight text-white">RUMS</h1>
        <p className="mt-1 text-sm text-slate-400">
          Rwanda Utilities Regulatory Authority
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-[#112240] p-8 shadow-2xl">
        <h2 className="mb-6 text-lg font-semibold text-white">Sign in to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@rura.rw"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#00C2CB]/50 focus:ring-2 focus:ring-[#00C2CB]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#00C2CB]/50 focus:ring-2 focus:ring-[#00C2CB]/20"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00C2CB] px-4 py-2.5 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#00C2CB]/90 focus:outline-none focus:ring-2 focus:ring-[#00C2CB]/50 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500">
        RUMS v1.0 · For authorized RURA personnel only
      </p>
    </div>
  );
}
