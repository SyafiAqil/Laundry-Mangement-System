"use client"

import { useEffect, useState } from "react";

import { getMyOrders } from "@/services/order.services";

import { getMyTransactions } from "@/services/transaction.services";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const [ordersResponse, transactionsResponse] = await Promise.all([
          getMyOrders(),
          getMyTransactions(),
        ]);

        setOrders(ordersResponse.data || []);

        setTransactions(transactionsResponse.data || []);
      } catch (error) {
        console.error(error);

        setOrders([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (order) => order.status !== "DIAMBIL",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "DIAMBIL",
  ).length;

  const totalSpent = transactions
    .filter(
      (trx) => trx.paymentStatus === "PAID" || trx.paymentStatus === "APPROVED",
    )
    .reduce((total, trx) => total + trx.amount, 0);

  const pendingPayments = transactions.filter(
    (trx) => trx.paymentStatus === "UNPAID" || trx.paymentStatus === "PENDING",
  ).length;

  const rejectedPayments = transactions.filter(
    (trx) => trx.paymentStatus === "REJECTED",
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

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
      <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-[36px] p-8 text-white">
        <p className="text-white/80">Welcome Back 👋</p>

        <h1 className="text-5xl font-black mt-2">{user?.name}</h1>

        <p className="mt-4 text-white/80 max-w-lg">
          Pantau status laundry dan transaksi Anda secara real-time.
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Total Orders</p>

          <h2 className="text-4xl font-black mt-2 text-violet-600">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Active Orders</p>

          <h2 className="text-4xl font-black mt-2 text-cyan-600">
            {activeOrders}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Total Spending</p>

          <h2 className="text-3xl font-black mt-2 text-green-600">
            Rp {totalSpent.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Pending Payment</p>

          <h2 className="text-4xl font-black mt-2 text-orange-500">
            {pendingPayments}
          </h2>
        </div>
      </div>

      {/* RECENT */}
      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        {/* ORDERS */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <h2 className="text-2xl font-black">Recent Laundry</h2>

          <div className="space-y-4 mt-6">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{order.orderCode}</h4>

                  <span className="text-sm font-medium text-violet-600">
                    {order.status}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-2">{order.weight} Kg</p>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <h2 className="text-2xl font-black">Recent Transactions</h2>

          <div className="space-y-4 mt-6">
            {recentTransactions.map((trx: any) => (
              <div key={trx.id} className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{trx.transactionCode}</h4>

                  <span
                    className={`text-sm font-medium ${
                      trx.paymentStatus === "PAID" ||
                      trx.paymentStatus === "APPROVED"
                        ? "text-green-600"
                        : trx.paymentStatus === "REJECTED"
                          ? "text-red-500"
                          : "text-orange-500"
                    }`}
                  >
                    {trx.paymentStatus}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-2">
                  Rp {trx.amount.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
