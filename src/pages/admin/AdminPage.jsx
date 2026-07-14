import React, { useEffect, useState } from "react";
import { Lock, LogOut, Loader2 } from "lucide-react";
import { supabase } from "../../assets/lib/supabaseClient";

export const AdminPage = () => {
  const [session, setSession] = useState(undefined); // undefined = belum dicek, null = belum login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("is_open, closed_message")
        .eq("id", 1)
        .single();
      if (data) {
        setIsOpen(data.is_open);
        setClosedMessage(data.closed_message ?? "");
      }
      setLoadingSettings(false);
    };
    fetchSettings();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setLoginError("Email atau password salah.");
    setLoggingIn(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("site_settings")
      .update({ is_open: isOpen, closed_message: closedMessage })
      .eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // masih cek session awal
  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-neutral-400" size={28} />
      </div>
    );
  }

  // belum login
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg"
        >
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
            <Lock size={20} />
          </span>
          <h1 className="text-center text-lg font-extrabold text-neutral-900">
            Admin Login
          </h1>
          <div className="mt-5 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          {loginError && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-full bg-neutral-900 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            {loggingIn ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    );
  }

  // sudah login
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-neutral-900">
            Pengaturan Toko
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-500"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>

        {loadingSettings ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-neutral-400" size={24} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  Status Website
                </p>
                <p className="text-xs text-neutral-500">
                  {isOpen ? "Sedang menerima pesanan" : "Sedang tutup"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
                  isOpen ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    isOpen ? "translate-x-0" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                Pesan saat tutup
              </label>
              <textarea
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-full cursor-pointer items-center justify-center rounded-full bg-neutral-900 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : saved
                  ? "Tersimpan ✓"
                  : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
