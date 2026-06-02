"use client";

import { registerAdmin } from "@/services/auth.services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!name || !email || !password) {
        setError("Semua field wajib diisi.");

        return;
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter.");

        return;
      }

      await registerAdmin({
        name,
        email,
        password,
      });

      alert("Admin berhasil dibuat.");

      setName("");
      setEmail("");
      setPassword("");

      router.push("/login");
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Gagal membuat admin.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center px-20">
          <Link href="/" className="text-3xl font-black text-violet-600">
            🫧 WashFlow
          </Link>

          <h1 className="text-6xl font-black mt-10 text-slate-900 leading-tight">
            Buat Admin
            <br />
            Dengan Mudah.
          </h1>

          <p className="text-slate-500 text-xl mt-8 max-w-lg">
            Tambahkan administrator baru untuk membantu mengelola customer,
            pesanan, transaksi, dan operasional laundry.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-14">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500">Admin Access</p>

              <h3 className="text-3xl font-black mt-2">Full</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <p className="text-slate-500">Security</p>

              <h3 className="text-3xl font-black mt-2">JWT</h3>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl">
              <div className="lg:hidden text-center mb-8">
                <Link href="/" className="text-3xl font-black text-violet-600">
                  🫧 WashFlow
                </Link>
              </div>

              <h2 className="text-4xl font-black text-slate-900">
                Register Admin 👨‍💼
              </h2>

              <p className="text-slate-500 mt-3">
                Buat akun administrator baru.
              </p>

              <form onSubmit={handleRegister} className="mt-10 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Nama
                  </label>

                  <input
                    type="text"
                    placeholder="Nama Admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-sm text-violet-700">
                  Akun yang dibuat melalui halaman ini akan otomatis memiliki
                  role Admin.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold transition"
                >
                  {loading ? "Membuat Akun..." : "Register Admin"}
                </button>
              </form>

              <div className="text-center mt-8">
                <Link
                  href="/login"
                  className="text-violet-600 font-medium hover:underline"
                >
                  Kembali ke Login
                </Link>
              </div>

              <p className="text-center text-slate-500 mt-8">
                WashFlow Laundry System
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
