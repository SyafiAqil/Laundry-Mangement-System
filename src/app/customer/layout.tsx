"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [mounted, setMounted] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      icon: "🏠",
      href: "/customer/dashboard",
    },
    {
      name: "Tracking",
      icon: "📦",
      href: "/customer/tracking",
    },
    {
      name: "Transactions",
      icon: "💳",
      href: "/customer/transactions",
    },
  ];

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      if (decoded.role !== "CUSTOMER") {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        router.push("/login");
        return;
      }
    } catch {
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    router.push("/login");
  };

  const menuClass = (path: string) =>
    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
      pathname === path
        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg font-medium"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-80 h-screen sticky top-0 p-6">
          <div className="bg-white rounded-[32px] shadow-xl h-full flex flex-col">
            {/* LOGO */}
            <div className="p-8 border-b border-slate-100">
              <h1 className="text-3xl font-black text-violet-600">
                🫧 WashFlow
              </h1>

              <p className="text-slate-500 mt-2">Customer Area</p>
            </div>

            {/* MENU */}
            <nav className="flex-1 p-6">
              <div className="space-y-3">
                {menus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={menuClass(menu.href)}
                  >
                    <span className="text-xl">{menu.icon}</span>

                    <span>{menu.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* USER */}
            <div className="p-6">
              <div className="bg-slate-100 rounded-3xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {user?.name || "Customer"}
                    </h3>

                    <p className="text-sm text-slate-500">Customer</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");

                    localStorage.removeItem("user");

                    router.push("/login");
                  }}
                  className="mt-4 w-full bg-white rounded-xl py-3 font-medium hover:bg-slate-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 p-8">
          {/* TOPBAR */}
          <div className="bg-white rounded-[32px] shadow-lg px-8 py-5 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black">
                {menus.find((m) => m.href === pathname)?.name || "Dashboard"}
              </h2>

              <p className="text-slate-500">Welcome back 👋</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 bg-slate-100 rounded-2xl">🔔</button>

              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || "C"}
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
