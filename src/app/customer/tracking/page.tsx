"use client"

import { getMyOrders } from "@/services/order.services";
import { useEffect, useState } from "react";

export default function TrackingPage() {
    const [orders, setOrders] =
  useState<any[]>([]);

const [loading, setLoading] =
  useState(true);

const [search, setSearch] =
  useState("");

useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders =
  async () => {
    try {
      setLoading(true);

      const response =
        await getMyOrders();

      setOrders(
        response.data || []
      );
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

const filteredOrders =
  orders.filter(
    (order) =>
      order.orderCode
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const getStatusColor = (
  status: string
) => {
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

const steps = [
  "DIPROSES",
  "SELESAI",
  "DIAMBIL",
];

return (
    <>
  {/* HEADER */}
  <div>
    <h1 className="text-5xl font-black">
      Tracking
    </h1>

    <p className="text-slate-500 mt-2">
      Pantau status laundry Anda.
    </p>
  </div>

  {/* SEARCH */}
  <div className="bg-white rounded-[28px] shadow-lg p-5 mt-8">

    <div className="relative">

      <input
        type="text"
        placeholder="Cari order..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full border border-slate-200 rounded-2xl px-5 py-4 pl-12 outline-none focus:border-violet-500"
      />

      <span className="absolute left-4 top-1/2 -translate-y-1/2">
        🔍
      </span>

    </div>

  </div>

  {/* INFO */}
  <div className="mt-6">

    <p className="text-slate-500">
      Menampilkan{" "}
      <span className="font-semibold text-slate-900">
        {filteredOrders.length}
      </span>{" "}
      order
    </p>

  </div>

  {/* EMPTY */}
  {filteredOrders.length ===
  0 ? (

    <div className="bg-white rounded-[32px] shadow-lg p-16 text-center mt-8">

      <div className="text-6xl">
        📦
      </div>

      <h3 className="text-2xl font-black mt-4">
        Tidak Ada Order
      </h3>

      <p className="text-slate-500 mt-2">
        Belum ada laundry yang dapat dilacak.
      </p>

    </div>

  ) : (

    <div className="space-y-6 mt-8">

      {filteredOrders.map(
        (order) => {

          const currentStep =
            steps.indexOf(
              order.status
            );

          return (
            <div
              key={order.id}
              className="bg-white rounded-[32px] p-8 shadow-lg"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-2xl font-black">
                    {
                      order.orderCode
                    }
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {order.weight} Kg
                  </p>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {
                    order.status
                  }
                </span>

              </div>

              {/* SUMMARY */}
              <div className="grid md:grid-cols-2 gap-4 mt-8">

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">
                    Total Price
                  </p>

                  <h4 className="font-bold mt-1">
                    Rp{" "}
                    {order.totalPrice?.toLocaleString(
                      "id-ID"
                    )}
                  </h4>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">
                    Created
                  </p>

                  <h4 className="font-bold mt-1">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "id-ID"
                    )}
                  </h4>

                </div>

              </div>

              {/* TIMELINE */}
              <div className="mt-10">

                <h4 className="font-bold mb-6">
                  Progress Tracking
                </h4>

                <div className="flex justify-between relative">

                  <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200" />

                  <div
                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-violet-600 to-cyan-500"
                    style={{
                      width: `${
                        (currentStep /
                          (steps.length -
                            1)) *
                        100
                      }%`,
                    }}
                  />

                  {steps.map(
                    (
                      step,
                      index
                    ) => (
                      <div
                        key={
                          step
                        }
                        className="relative z-10 flex flex-col items-center"
                      >

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index <=
                            currentStep
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          ✓
                        </div>

                        <p className="text-xs mt-3 font-medium">
                          {step}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>
          );
        }
      )}

    </div>

  )}
</>
)


}