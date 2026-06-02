"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "@/services/user.services";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);

  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
  });

  const fetchUserDetail = async (id: number) => {
    try {
      setDetailLoading(true);

      const response = await getUserById(id);

      setSelectedUser(response.data);

      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase()),
  );

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      const customers = response.data.filter(
        (user: any) => user.role === "CUSTOMER",
      );

      setUsers(customers);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);

      if (!form.name || !form.email || !form.phone || !form.password) {
        alert("Lengkapi semua data.");
        return;
      }

      await createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setShowModal(false);

      fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus user?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEdit = (user: any) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });

    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);

      await updateUser(editForm.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      });

      setShowEditModal(false);

      fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black">Customers</h1>

          <p className="text-slate-500 mt-2">Kelola pelanggan laundry.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-[320px]">
            <input
              type="text"
              placeholder="Cari customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white shadow-lg rounded-2xl pl-12 pr-4 py-4 outline-none"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 py-4 rounded-2xl shadow-lg"
          >
            + Customer
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="inline-flex bg-white shadow-lg rounded-3xl px-8 py-5">
          <div>
            <p className="text-slate-500 text-sm">Total Customer</p>

            <h2 className="text-3xl font-black text-cyan-600 mt-1">
              {users.length}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-[28px] p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-black text-lg">{user.name}</h3>

                  <p className="text-slate-500">{user.email}</p>

                  <p className="text-slate-400 text-sm mt-1">{user.phone}</p>

                  <p className="text-slate-400 text-sm mt-1">{user.phone}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.role === "ADMIN"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-cyan-100 text-cyan-700"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => fetchUserDetail(user.id)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                Detail
              </button>

              <button
                onClick={() => handleOpenEdit(user)}
                className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-8 text-white">
              <h2 className="text-3xl font-black">👤 Tambah Customer</h2>

              <p className="mt-2 text-white/80">
                Buat akun pelanggan baru untuk WashFlow.
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Lengkap
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Dewi Lestari"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor HP
                  </label>

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="customer@email.com"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>

              {/* PREVIEW CARD */}
              <div className="mt-8 bg-gradient-to-r from-violet-50 to-cyan-50 rounded-3xl p-5">
                <h3 className="font-bold">Preview Customer</h3>

                <div className="flex items-center gap-4 mt-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    {form.name ? form.name[0].toUpperCase() : "?"}
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      {form.name || "Nama Customer"}
                    </h4>

                    <p className="text-slate-500 text-sm">
                      {form.email || "email@example.com"}
                    </p>
                  </div>
                </div>
              </div>

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
                  {loading ? "Menyimpan..." : "✨ Buat Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <div
            onClick={() => setShowDetailModal(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* PANEL */}
          <div className="absolute right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-8 text-white">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
                  {selectedUser.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-3xl font-black">{selectedUser.name}</h2>

                  <p className="text-white/80 mt-1">{selectedUser.email}</p>

                  <span className="inline-flex mt-3 px-4 py-2 rounded-full bg-white/20">
                    👤 {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* PROFILE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-3xl p-5">
                  <p className="text-slate-500 text-sm">Phone</p>

                  <h3 className="font-bold mt-2">
                    {selectedUser.phone || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-3xl p-5">
                  <p className="text-slate-500 text-sm">Member Since</p>

                  <h3 className="font-bold mt-2">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "id-ID",
                    )}
                  </h3>
                </div>
              </div>

              {/* STATS */}
              <div className="mt-6">
                <h3 className="font-black text-xl">Statistik</h3>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-violet-50 rounded-3xl p-5">
                    <p className="text-violet-600 text-sm">Orders</p>

                    <h2 className="text-3xl font-black mt-2">
                      {selectedUser.orders?.length || 0}
                    </h2>
                  </div>

                  <div className="bg-green-50 rounded-3xl p-5">
                    <p className="text-green-600 text-sm">Spending</p>

                    <h2 className="text-lg font-black mt-2">
                      Rp{" "}
                      {selectedUser?.orders
                        ?.reduce(
                          (total: number, order: any) =>
                            total + order.totalPrice,
                          0,
                        )
                        .toLocaleString("id-ID")}
                    </h2>
                  </div>
                </div>
              </div>

              {/* STATUS ORDER */}
              <div className="mt-8">
                <h3 className="font-black text-xl">Status Order</h3>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-violet-50 rounded-3xl p-5">
                    <p className="text-violet-600 text-sm">Diproses</p>

                    <h2 className="text-3xl font-black mt-2">
                      {
                        selectedUser?.orders?.filter(
                          (order: any) => order.status === "DIPROSES",
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="bg-cyan-50 rounded-3xl p-5">
                    <p className="text-cyan-600 text-sm">Selesai</p>

                    <h2 className="text-3xl font-black mt-2">
                      {
                        selectedUser?.orders?.filter(
                          (order: any) => order.status === "SELESAI",
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="bg-green-50 rounded-3xl p-5">
                    <p className="text-green-600 text-sm">Diambil</p>

                    <h2 className="text-3xl font-black mt-2">
                      {
                        selectedUser?.orders?.filter(
                          (order: any) => order.status === "DIAMBIL",
                        ).length
                      }
                    </h2>
                  </div>
                </div>
              </div>

              {/* RIWAYAT ORDER */}
              <div className="mt-8">
                <h3 className="font-black text-xl">Riwayat Order</h3>

                <div className="space-y-4 mt-5">
                  {selectedUser?.orders?.length ? (
                    selectedUser.orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="bg-slate-50 rounded-2xl p-5 hover:bg-slate-100 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{order.orderCode}</h4>

                            <p className="text-sm text-slate-500 mt-1">
                              {new Date(order.createdAt).toLocaleDateString(
                                "id-ID",
                              )}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "DIPROSES"
                                ? "bg-violet-100 text-violet-700"
                                : order.status === "SELESAI"
                                  ? "bg-cyan-100 text-cyan-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-slate-500 text-sm">
                            Total Pembayaran
                          </p>

                          <p className="font-bold">
                            Rp {order.totalPrice.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-5 text-slate-500">
                      Belum ada riwayat order.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t p-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <div
            onClick={() => setShowEditModal(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* PANEL */}
          <div className="absolute right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black">
                  {" "}
                  {editForm.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h2 className="text-3xl font-black">Edit Customer</h2>

                  <p className="text-white/80">Perbarui informasi pelanggan.</p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama</label>

                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-4 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-4 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor HP
                  </label>

                  <input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-4 outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* PREVIEW */}
              <div className="mt-8 bg-gradient-to-r from-violet-50 to-cyan-50 rounded-3xl p-5">
                <h3 className="font-bold">Preview</h3>

                <div className="flex items-center gap-4 mt-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black">
                    {editForm.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <h4 className="font-semibold">{editForm.name}</h4>

                    <p className="text-slate-500 text-sm">{editForm.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t p-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 border rounded-2xl py-4"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                disabled={editLoading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-orange-500 text-white rounded-2xl py-4 font-semibold"
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
