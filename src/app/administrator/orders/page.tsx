"use client";

import { useEffect, useState } from "react";

import {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} from "@/services/order.services";

import { getUsers } from "@/services/user.services";
import { button, span } from "framer-motion/m";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [users, setUsers] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    weight: "",
    paymentMethod: "cash",
  });

  const [customerSearch, setCustomerSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const PRICE_PER_KG = 6000;

  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await getOrders();

      setOrders(
        Array.isArray(response?.data?.orders) ? response.data.orders : [],
      );
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    const data = await getUsers();

    setUsers(Array.isArray(data) ? data : data.data || []);
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);

      await createOrder({
        userId: Number(form.userId),
        weight: Number(form.weight),
        totalPrice,
        paymentMethod: form.paymentMethod,
      });

      setShowModal(false);

      fetchOrders();

      if (!form.userId || !form.weight || !form.paymentMethod) {
        alert("Mohon lengkapi semua data.");

        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteOrder(deleteId);

      fetchOrders();

      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIPROSES":
        return "bg-violet-100 text-violet-700";

      case "SELESAI":
        return "bg-cyan-100 text-cyan-700";

      case "DIAMBIL":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  console.log("orders =", orders);
  console.log("isArray =", Array.isArray(orders));

  const totalPrice = Number(form.weight || 0) * PRICE_PER_KG;

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  const filteredOrders = orders.filter((order) =>
    `${order.orderCode} ${order.customer?.name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900">Orders</h1>

          <p className="text-slate-500 mt-2">Kelola seluruh pesanan laundry.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-medium shadow-lg hover:opacity-90 transition"
        >
          + Buat Order
        </button>
      </div>

      {/* STATS */}
      <div className="grid lg:grid-cols-4 gap-5 mt-8">
        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Total Orders</p>

          <h2 className="text-4xl font-black mt-2">{orders.length}</h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Diproses</p>

          <h2 className="text-4xl font-black mt-2 text-violet-600">
            {orders.filter((o) => o.status === "DIPROSES").length}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Selesai</p>

          <h2 className="text-4xl font-black mt-2 text-cyan-600">
            {orders.filter((o) => o.status === "SELESAI").length}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Diambil</p>

          <h2 className="text-4xl font-black mt-2 text-green-600">
            {orders.filter((o) => o.status === "DIAMBIL").length}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-[28px] shadow-lg p-5 mt-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari order berdasarkan kode atau customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-5 py-4 pl-12 outline-none focus:border-violet-500"
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>
      </div>

      {/* INFO */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-900">
            {filteredOrders.length}
          </span>{" "}
          order
        </p>
      </div>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-lg p-16 text-center mt-8">
          <div className="text-6xl">📦</div>

          <h3 className="text-2xl font-black mt-4">Tidak Ada Order</h3>

          <p className="text-slate-500 mt-2">Belum ada order yang tersedia.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-6 mt-8">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[32px] p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    📦
                  </div>

                  <div>
                    <h3 className="font-black text-lg">{order.orderCode}</h3>

                    <p className="text-slate-500">{order.customer?.name}</p>

                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* DETAIL */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs">Weight</p>

                  <h4 className="font-semibold mt-1">{order.weight} KG</h4>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs">Total</p>

                  <h4 className="font-semibold mt-1">
                    Rp {order.totalPrice?.toLocaleString("id-ID")}
                  </h4>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs">Payment</p>

                  <h4
                    className={`font-semibold mt-1 ${
                      order.transaction?.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {order.transaction?.paymentStatus}
                  </h4>
                </div>
              </div>

              {/* ACTION */}
              <div className="flex gap-3 mt-8">
                {order.status === "DIPROSES" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "SELESAI")}
                    className="flex-1 bg-cyan-100 text-cyan-700 py-3 rounded-xl hover:bg-cyan-200 transition"
                  >
                    Tandai Selesai
                  </button>
                )}

                {order.status === "SELESAI" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "DIAMBIL")}
                    className="flex-1 bg-green-100 text-green-700 py-3 rounded-xl hover:bg-green-200 transition"
                  >
                    Tandai Diambil
                  </button>
                )}

                <button
                  onClick={() => setDeleteId(order.id)}
                  className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-8 text-white">
              <h2 className="text-3xl font-black">📦 Buat Order Baru</h2>

              <p className="mt-2 text-white/80">
                Tambahkan pesanan laundry baru ke sistem WashFlow.
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-8 overflow-y-auto max-h-[75vh]">
              <div className="grid md:grid-cols-2 gap-5">
                {/* CUSTOMER */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Customer
                  </label>

                  <input
                    type="text"
                    placeholder="Cari customer..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />

                  <div className="mt-3 max-h-56 overflow-y-auto space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(user);

                          setForm({
                            ...form,
                            userId: user.id.toString(),
                          });
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition ${
                          selectedCustomer?.id === user.id
                            ? "border-violet-500 bg-violet-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h4 className="font-semibold">{user.name}</h4>

                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* WEIGHT */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Berat Cucian
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        weight: e.target.value,
                      })
                    }
                    placeholder="2.5"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>

                {/* PAYMENT */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Metode Pembayaran
                  </label>

                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    <option value="cash">Cash</option>

                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              {/* PRICE CARD */}
              <div className="mt-8 bg-gradient-to-r from-violet-50 to-cyan-50 rounded-3xl p-6">
                <h3 className="font-black text-lg">Ringkasan Order</h3>

                <div className="space-y-3 mt-5">
                  <div className="flex justify-between">
                    <span>Berat Cucian</span>

                    <span className="font-semibold">{form.weight || 0} kg</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Harga / Kg</span>

                    <span className="font-semibold">
                      Rp {PRICE_PER_KG.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Metode Bayar</span>

                    <span className="font-semibold capitalize">
                      {form.paymentMethod}
                    </span>
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-between">
                    <span className="text-xl font-black">Total</span>

                    <span className="text-3xl font-black text-violet-600">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* CUSTOMER PREVIEW */}
              {form.userId && (
                <div className="mt-6 bg-slate-50 rounded-3xl p-5">
                  <h3 className="font-bold">Customer Terpilih</h3>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {
                        users.find((u) => String(u.id) === form.userId)
                          ?.name?.[0]
                      }
                    </div>

                    <div>
                      <h4 className="font-semibold">
                        {users.find((u) => String(u.id) === form.userId)?.name}
                      </h4>

                      <p className="text-slate-500 text-sm">
                        {users.find((u) => String(u.id) === form.userId)?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 py-4 rounded-2xl"
                >
                  Batal
                </button>

                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
                >
                  {loading ? "Menyimpan..." : "✨ Buat Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-[36px] p-8 w-full max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <span className="text-3xl">🗑️</span>
            </div>

            <h2 className="text-2xl font-black text-center mt-6">
              Hapus Order?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              Data order yang dihapus tidak dapat dikembalikan lagi.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-200"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
