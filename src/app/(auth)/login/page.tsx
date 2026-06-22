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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-purple/40">
          <RumsLogoIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">RUMS</h1>
        <p className="mt-1 text-sm text-white/60">
          Rwanda Utilities Regulatory Authority
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="mb-6 text-lg font-semibold text-white">Sign in to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
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
              className="w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 text-sm text-white placeholder-white/35 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
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
                className="w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 pr-10 text-sm text-white placeholder-white/35 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/25">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/40 transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-white/40">
        RUMS v1.0 · For authorized RURA personnel only
      </p>
    </div>
  );
}
