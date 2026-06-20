export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg relative flex min-h-screen items-center justify-center px-4">
      {/* Dark overlay to keep text legible */}
      <div className="absolute inset-0 bg-[#0D1B2A]/40" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
