"use client";

import {
  getMyTransactions,
  uploadPaymentProof,
} from "@/services/transaction.services";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const [uploading, setUploading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getMyTransactions();

      setTransactions(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (trx) =>
      trx.transactionCode.toLowerCase().includes(search.toLowerCase()) ||
      trx.order?.orderCode?.toLowerCase().includes(search.toLowerCase()),
  );

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-blue-100 text-blue-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "UNPAID":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile || !selectedTransaction) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      await uploadPaymentProof(selectedTransaction.id, formData);

      await fetchTransactions();

      setSelectedFile(null);
      setSelectedTransaction(null);
      setShowSuccess(true);
    } catch (error: any) {
      console.log("ERROR RESPONSE:", error.response?.data);

      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-black">Transactions</h1>

        <p className="text-slate-500 mt-2">Kelola pembayaran laundry Anda.</p>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-[28px] shadow-lg p-5 mt-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-5 py-4 pl-12 outline-none focus:border-violet-500"
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
        </div>
      </div>

      {/* LIST */}
      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        {filteredTransactions.map((trx) => (
          <div key={trx.id} className="bg-white rounded-[32px] p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-lg">{trx.transactionCode}</h3>

                <p className="text-slate-500 mt-1">{trx.order?.orderCode}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentColor(
                  trx.paymentStatus,
                )}`}
              >
                {trx.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-slate-500 text-xs">Amount</p>

                <h4 className="font-semibold mt-1">
                  Rp {trx.amount.toLocaleString("id-ID")}
                </h4>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-slate-500 text-xs">Method</p>

                <h4 className="font-semibold mt-1 capitalize">
                  {trx.paymentMethod}
                </h4>
              </div>
            </div>

            {/* PROOF */}
            <div className="mt-6">
              {trx.paymentStatus === "REJECTED" ? (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="font-semibold text-red-700">
                      Pembayaran Ditolak
                    </p>

                    <p className="text-sm text-red-600 mt-1">
                      Silakan upload ulang bukti pembayaran yang benar.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTransaction(trx);
                      setSelectedFile(null);
                    }}
                    className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl font-semibold"
                  >
                    Upload Ulang Bukti Pembayaran
                  </button>
                </div>
              ) : trx.paymentStatus === "PENDING" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <p className="font-semibold text-yellow-700">
                    Menunggu Verifikasi Admin
                  </p>
                </div>
              ) : trx.paymentStatus === "APPROVED" ||
                trx.paymentStatus === "PAID" ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="font-semibold text-green-700">
                    Pembayaran Berhasil Diverifikasi
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedTransaction(trx);
                    setSelectedFile(null);
                  }}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl font-semibold"
                >
                  Upload Bukti Pembayaran
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md">
            <h2 className="text-3xl font-black">Upload Bukti</h2>

            <p className="text-slate-500 mt-2">
              {selectedTransaction.transactionCode}
            </p>

            <label className="block mt-6">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />

              <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center cursor-pointer hover:border-violet-500 transition">
                <div className="text-5xl">📄</div>

                <h3 className="font-bold mt-4">Upload Bukti Pembayaran</h3>

                <p className="text-slate-500 mt-2">JPG, PNG atau JPEG</p>

                {selectedFile && (
                  <p className="mt-4 text-violet-600 font-medium">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </label>

            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-56 object-cover rounded-2xl mt-5"
              />
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 border border-slate-200 py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={handleUploadProof}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto">
              ✅
            </div>

            <h2 className="text-3xl font-black mt-5">Upload Berhasil</h2>

            <p className="text-slate-500 mt-3">
              Bukti pembayaran berhasil dikirim dan sedang menunggu verifikasi
              admin.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full mt-8 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </>
  );
}
