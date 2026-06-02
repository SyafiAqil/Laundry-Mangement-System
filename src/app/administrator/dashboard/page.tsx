"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/services/dashboard.services";
import { getOrders } from "@/services/order.services";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidTransactions: 0,
    totalOrders: 0,
    activeOrders: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();

      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([fetchDashboard(), fetchOrders()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const completionRate =
    dashboard.totalOrders > 0
      ? Math.round(
          ((dashboard.totalOrders - dashboard.activeOrders) /
            dashboard.totalOrders) *
            100,
        )
      : 0;

  const paymentRate =
    dashboard.paidTransactions + dashboard.pendingPayments > 0
      ? Math.round(
          (dashboard.paidTransactions /
            (dashboard.paidTransactions + dashboard.pendingPayments)) *
            100,
        )
      : 0;

  const recentOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-[36px] p-8 text-white shadow-xl">
        <p className="text-white/80">Welcome Back 👋</p>

        <h1 className="text-5xl font-black mt-2">{user.name || "Admin"}</h1>

        <p className="mt-4 text-white/80 max-w-xl">
          Pantau performa bisnis laundry, transaksi pembayaran dan status order
          secara real-time.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3">
            Revenue Rp {dashboard.totalRevenue?.toLocaleString("id-ID")}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3">
            {dashboard.activeOrders} Order Aktif
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Revenue</p>

          <h2 className="text-3xl font-black mt-3 text-violet-600">
            Rp {dashboard.totalRevenue?.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Orders</p>

          <h2 className="text-4xl font-black mt-3 text-cyan-600">
            {dashboard.totalOrders}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Active</p>

          <h2 className="text-4xl font-black mt-3 text-orange-500">
            {dashboard.activeOrders}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Paid</p>

          <h2 className="text-4xl font-black mt-3 text-green-600">
            {dashboard.paidTransactions}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Pending</p>

          <h2 className="text-4xl font-black mt-3 text-red-500">
            {dashboard.pendingPayments}
          </h2>
        </div>
      </div>

      {/* QUICK ACTION + HEALTH */}
      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        {/* QUICK ACTION */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <h2 className="text-2xl font-black">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link
              href="/administrator/orders"
              className="bg-violet-50 hover:bg-violet-100 transition rounded-3xl p-5"
            >
              <p className="text-3xl">🧼</p>

              <h3 className="font-bold mt-3">Orders</h3>

              <p className="text-sm text-slate-500 mt-1">Kelola pesanan</p>
            </Link>

            <Link
              href="/administrator/users"
              className="bg-cyan-50 hover:bg-cyan-100 transition rounded-3xl p-5"
            >
              <p className="text-3xl">👥</p>

              <h3 className="font-bold mt-3">Customers</h3>

              <p className="text-sm text-slate-500 mt-1">Data pelanggan</p>
            </Link>

            <Link
              href="/administrator/transactions"
              className="bg-green-50 hover:bg-green-100 transition rounded-3xl p-5"
            >
              <p className="text-3xl">💳</p>

              <h3 className="font-bold mt-3">Payments</h3>

              <p className="text-sm text-slate-500 mt-1">
                Verifikasi transaksi
              </p>
            </Link>

            <Link
              href="/administrator/admins"
              className="bg-orange-50 hover:bg-orange-100 transition rounded-3xl p-5"
            >
              <p className="text-3xl">⚙️</p>

              <h3 className="font-bold mt-3">Admins</h3>

              <p className="text-sm text-slate-500 mt-1">Kelola admin</p>
            </Link>
          </div>
        </div>

        {/* BUSINESS HEALTH */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <h2 className="text-2xl font-black">Business Health</h2>

          <div className="space-y-6 mt-8">
            <div>
              <div className="flex justify-between mb-2">
                <span>Payment Success</span>

                <span className="font-bold">{paymentRate}%</span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${paymentRate}%`,
                  }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Order Completion</span>

                <span className="font-bold">{completionRate}%</span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${completionRate}%`,
                  }}
                  className="h-full bg-violet-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-5">
              <p className="text-slate-500">Total Revenue</p>

              <h3 className="text-3xl font-black mt-2">
                Rp {dashboard.totalRevenue?.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="bg-white rounded-[32px] p-8 shadow-lg mt-8">
        <h2 className="text-2xl font-black">System Status</h2>

        <div className="grid md:grid-cols-3 gap-5 mt-6">
          <div className="bg-green-50 rounded-3xl p-5">
            <p className="text-green-700 font-semibold">API Status</p>

            <h3 className="text-2xl font-black mt-2">Online</h3>
          </div>

          <div className="bg-violet-50 rounded-3xl p-5">
            <p className="text-violet-700 font-semibold">Active Orders</p>

            <h3 className="text-2xl font-black mt-2">
              {dashboard.activeOrders}
            </h3>
          </div>

          <div className="bg-cyan-50 rounded-3xl p-5">
            <p className="text-cyan-700 font-semibold">Verified Payments</p>

            <h3 className="text-2xl font-black mt-2">
              {dashboard.paidTransactions}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
