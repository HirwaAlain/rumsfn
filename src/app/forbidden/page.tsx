import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0D1B2A] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 ring-1 ring-danger/30">
        <ShieldX className="h-8 w-8 text-danger" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Access Forbidden</h1>
        <p className="mt-2 text-sm text-slate-400">
          You do not have permission to view this page.
          <br />
          Your role does not match the required portal access.
        </p>
      </div>

      <Link
        href="/login"
        className="rounded-lg bg-[#00C2CB] px-6 py-2.5 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#00C2CB]/90"
      >
        Return to Login
      </Link>

      <p className="text-xs text-slate-600">
        RUMS v1.0 · Rwanda Utilities Regulatory Authority
      </p>
    </div>
  );
}
