import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign In — CustomWorks" }] }),
});

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    if (!supabase) {
      setErr("Auth backend not connected.");
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Email and password are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    if (!supabase) {
      setErr("Auth backend not connected.");
      return;
    }

    setLoading(true);

    if (mode === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? "",
          addresses: [],
        });
        navigate({ to: "/account" });
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        setErr("");
        // Show confirmation message if email confirmation required
        if (!data.session) {
          setErr("Check your email to confirm your account, then sign in.");
          setLoading(false);
          return;
        }
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? "",
          addresses: [],
        });
        navigate({ to: "/account" });
      }
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </p>
          <h1 className="mt-3 font-serif text-4xl">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="mt-10 flex border-b border-border">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setErr(""); setMode(m); }}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.25em] ${
                mode === m
                  ? "text-foreground border-b-2 border-foreground -mb-px"
                  : "text-muted-foreground"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="mt-8 w-full h-12 border border-border bg-paper hover:bg-cream flex items-center justify-center gap-3 text-sm text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-1.013.174-1.998.482-2.916V3.752H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 3.752L3.964 6.084C4.672 3.964 6.656 3.58 9 3.58Z"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          or
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground py-2 outline-none text-sm"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground py-2 outline-none text-sm"
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </label>

          {err && (
            <p className="text-xs text-destructive">{err}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>

          {mode === "signin" && (
            <button
              type="button"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setErr("Password reset coming soon.")}
            >
              Forgot password?
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
}