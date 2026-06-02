"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.services";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await login(email, password);

      const token = result.data.accessToken;

      const role = result.data.user.role;

      localStorage.setItem("token", token);

      localStorage.setItem("role", role);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      console.log("ROLE:", role);

      if (role === "ADMIN") {
        router.push("/administrator/dashboard");
      } else if (role === "CUSTOMER") {
        router.push("/customer/dashboard");
      } else {
        setError("Role tidak dikenali.");
      }
    } catch (error: any) {
      console.log("MASUK CATCH");
      if (error.response?.status === 401) {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
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
            Kelola Laundry
            <br />
            Lebih Praktis.
          </h1>

          <p className="text-slate-500 text-xl mt-8 max-w-lg">
            Dashboard modern untuk mengelola customer, order, transaksi dan
            tracking laundry.
          </p>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-slate-500">Features</p>

            <h3 className="text-3xl font-black mt-2">6+</h3>

            <p className="text-sm text-slate-500 mt-2">Integrated modules</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg mt-2">
            <p className="text-slate-500">Tracking</p>

            <h3 className="text-3xl font-black mt-2">24/7</h3>

            <p className="text-sm text-slate-500 mt-2">Real-time monitoring</p>
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
                Welcome Back 👋
              </h2>

              <p className="text-slate-500 mt-3">
                Login untuk mengakses dashboard laundry.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mt-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-10 space-y-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold transition"
                >
                  {loading ? "Loading..." : "Masuk"}
                </button>
              </form>

              <div className="text-center mt-8">
                <Link
                  href="/register"
                  className="text-violet-600 font-medium hover:underline"
                >
                  Belum punya akun? Daftar di sini
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
