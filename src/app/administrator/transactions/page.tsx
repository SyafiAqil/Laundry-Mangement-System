"use client";

import {
  approveTransaction,
  deleteTransaction,
  getTransactions,
  rejectTransaction,
} from "@/services/transaction.services";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (trx: any) =>
      trx.transactionCode.toLowerCase().includes(search.toLowerCase()) ||
      trx.order.customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = transactions.reduce((sum, trx) => sum + trx.amount, 0);

  const paidCount = transactions.filter(
    (trx) => trx.paymentStatus === "PAID",
  ).length;

  const unpaidCount = transactions.filter(
    (trx) => trx.paymentStatus === "UNPAID",
  ).length;

  const handleApprove = async (id: number) => {
    try {
      console.log("APPROVE ID:", id);

      console.log("STATUS:", selectedTransaction?.paymentStatus);

      await approveTransaction(id);

      await fetchTransactions();

      setShowDetailModal(false);
    } catch (error: any) {
      console.log("ERROR DATA:", error.response?.data);

      console.log("ERROR STATUS:", error.response?.status);

      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    const confirmReject = confirm("Yakin ingin menolak pembayaran ini?");

    if (!confirmReject) return;

    try {
      await rejectTransaction(id);

      await fetchTransactions();

      setShowDetailModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const [showImagePreview, setShowImagePreview] = useState(false);

  const getImageUrl = (path: string) => {
    if (!path) return "";

    return `https://laundy-production.up.railway.app${path}`;
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus transaksi ini?");

    if (!confirmDelete) return;

    try {
      await deleteTransaction(id);

      await fetchTransactions();

      if (selectedTransaction?.id === id) {
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteTransaction(selectedDeleteId);

      fetchTransactions();

      setShowDeleteModal(false);
      setSelectedDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedTransaction?.paymentProof) {
      console.log("RAW:", selectedTransaction.paymentProof);

      console.log("FULL:", getImageUrl(selectedTransaction.paymentProof));
    }
  }, [selectedTransaction]);

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black">Transactions</h1>

          <p className="text-slate-500 mt-2">Kelola pembayaran laundry.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Total Revenue</p>

          <h2 className="text-4xl font-black mt-2 text-violet-600">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Paid Transactions</p>

          <h2 className="text-4xl font-black mt-2 text-green-600">
            {paidCount}
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-lg">
          <p className="text-slate-500">Pending Payments</p>

          <h2 className="text-4xl font-black mt-2 text-red-500">
            {unpaidCount}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-[28px] shadow-lg p-5 mt-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari transaksi berdasarkan kode, customer atau order..."
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
            {filteredTransactions.length}
          </span>{" "}
          transaksi
        </p>
      </div>

      {/* EMPTY STATE */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-lg p-16 text-center mt-8">
          <div className="text-6xl">💳</div>

          <h3 className="text-2xl font-black mt-4">Tidak Ada Transaksi</h3>

          <p className="text-slate-500 mt-2">
            Belum ada transaksi yang tersedia.
          </p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-6 mt-8">
          {filteredTransactions.map((trx: any) => (
            <div
              key={trx.id}
              className="bg-white rounded-[32px] p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    💳
                  </div>

                  <div>
                    <h3 className="font-black text-lg">
                      {trx.transactionCode}
                    </h3>

                    <p className="text-slate-500">
                      {trx.order?.customer?.name}
                    </p>

                    <p className="text-slate-400 text-sm mt-1">
                      {trx.order?.orderCode}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trx.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {trx.paymentStatus}
                </span>
              </div>

              {/* DETAIL */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs">Payment Method</p>

                  <h4 className="font-semibold mt-1 capitalize">
                    {trx.paymentMethod}
                  </h4>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs">Amount</p>

                  <h4 className="font-semibold mt-1">
                    Rp {trx.amount.toLocaleString("id-ID")}
                  </h4>
                </div>
              </div>

              {/* ACTION */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setSelectedTransaction(trx);

                    setShowDetailModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl hover:opacity-90 transition"
                >
                  Detail
                </button>

                <button
                  onClick={() => {
                    setSelectedDeleteId(trx.id);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL TRANSACTION */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setShowDetailModal(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-8 text-white">
              <h2 className="text-3xl font-black">Transaction Detail</h2>

              <p className="mt-2 text-white/80">
                {selectedTransaction.transactionCode}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Customer</p>

                <h3 className="font-bold mt-2">
                  {selectedTransaction.order?.customer?.name}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Order Code</p>

                <h3 className="font-bold mt-2">
                  {selectedTransaction.order?.orderCode}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Weight</p>

                <h3 className="font-bold mt-2">
                  {selectedTransaction.order?.weight} Kg
                </h3>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Total Payment</p>

                <h3 className="font-bold mt-2">
                  Rp {selectedTransaction.amount.toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Payment Method</p>

                <h3 className="font-bold mt-2 capitalize">
                  {selectedTransaction.paymentMethod}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="text-slate-500 text-sm">Status</p>

                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl mt-3 font-semibold ${
                    selectedTransaction.paymentStatus === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : selectedTransaction.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedTransaction.paymentStatus === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {selectedTransaction.paymentStatus === "APPROVED" && "✅"}
                  {selectedTransaction.paymentStatus === "PENDING" && "⏳"}
                  {selectedTransaction.paymentStatus === "REJECTED" && "❌"}
                  {selectedTransaction.paymentStatus === "UNPAID" && "💳"}

                  {selectedTransaction.paymentStatus}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-[32px] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-slate-500 text-sm">Payment Proof</p>

                    <h3 className="text-xl font-black mt-1">
                      Bukti Pembayaran
                    </h3>
                  </div>

                  {selectedTransaction.paymentProof && (
                    <button
                      onClick={() => setShowImagePreview(true)}
                      className="bg-violet-100 text-violet-700 px-4 py-2 rounded-2xl font-semibold hover:bg-violet-200 transition"
                    >
                      🔍 Preview
                    </button>
                  )}
                </div>

                {selectedTransaction.paymentProof ? (
                  <div
                    className="group cursor-pointer"
                    onClick={() => setShowImagePreview(true)}
                  >
                    <div className="relative overflow-hidden rounded-[28px] border border-slate-200">
                      <img
                        src={getImageUrl(selectedTransaction.paymentProof)}
                        alt="Payment Proof"
                        className="w-full h-80 object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm">
                        Klik untuk memperbesar
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-[28px] p-12 text-center">
                    <div className="text-6xl">📄</div>

                    <h3 className="font-bold text-xl mt-4">
                      Belum Ada Bukti Pembayaran
                    </h3>

                    <p className="text-slate-500 mt-2">
                      Customer belum mengunggah bukti pembayaran.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t bg-white p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 border border-slate-200 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition"
                >
                  Tutup
                </button>

                {selectedTransaction.paymentProof &&
                  selectedTransaction.paymentStatus !== "APPROVED" && (
                    <>
                      <button
                        onClick={() => handleReject(selectedTransaction.id)}
                        className="flex-1 bg-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-200 transition"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleApprove(selectedTransaction.id)}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold"
                      >
                        Approve
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showImagePreview && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-8"
          onClick={() => setShowImagePreview(false)}
        >
          <button className="absolute top-6 right-6 bg-white text-black w-12 h-12 rounded-full text-xl font-bold">
            ✕
          </button>

          <img
            src={getImageUrl(selectedTransaction.paymentProof)}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* MODAL */}
          <div className="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl">
                🗑️
              </div>
            </div>

            <h2 className="text-3xl font-black text-center mt-6">
              Hapus Transaksi?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              Transaksi yang sudah dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-slate-200 py-4 rounded-2xl font-medium hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-medium hover:bg-red-600 transition"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showImagePreview && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setShowImagePreview(false)}
        >
          <button className="absolute top-6 right-6 bg-white text-slate-900 w-12 h-12 rounded-full text-xl font-bold">
            ✕
          </button>

          <img
            src={getImageUrl(selectedTransaction?.paymentProof)}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
