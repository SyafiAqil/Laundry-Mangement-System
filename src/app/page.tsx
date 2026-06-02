import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "📦",
      title: "Kelola Pesanan",
      desc: "Semua order tersimpan otomatis dan mudah dipantau.",
    },
    {
      icon: "💳",
      title: "Pembayaran Online",
      desc: "Upload bukti transfer dan verifikasi pembayaran.",
    },
    {
      icon: "🫧",
      title: "Tracking Laundry",
      desc: "Pelanggan dapat melihat status laundry realtime.",
    },
  ];

  const steps = [
    "Tambah Customer",
    "Buat Order",
    "Proses Laundry",
    "Selesai & Diambil",
  ];

  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Background Blur */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl"></div>

        <div className="absolute top-[300px] right-0 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="font-black text-2xl text-violet-600"
          >
            🫧 WashFlow
          </Link>

          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
            <a href="#features">
              Features
            </a>

            <a href="#tracking">
              Tracking
            </a>

            <a href="#cta">
              Get Started
            </a>
          </div>

          <Link
            href="/login"
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl transition"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full">
              ✨ Laundry Management System
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mt-8 leading-tight text-slate-900">
              Laundry Lebih
              <br />
              Praktis &
              <br />
              Modern.
            </h1>

            <p className="text-slate-500 text-xl mt-8 max-w-xl leading-relaxed">
              Kelola customer, pesanan,
              pembayaran dan tracking laundry
              dalam satu aplikasi modern yang
              membantu bisnis berjalan lebih
              cepat dan rapi.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/login"
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-medium transition"
              >
                Mulai Sekarang
              </Link>

              <Link
                href="/tracking"
                className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-medium hover:bg-slate-50 transition"
              >
                Lacak Pesanan
              </Link>
            </div>

            <div className="flex gap-12 mt-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900">
                  1K+
                </h3>

                <p className="text-slate-500">
                  Orders Processed
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-slate-900">
                  98%
                </h3>

                <p className="text-slate-500">
                  Customer Satisfaction
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100">
              <div className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white p-6 rounded-3xl">
                <p className="opacity-90">
                  Revenue
                </p>

                <h3 className="text-4xl font-black mt-2">
                  Rp12.5M
                </h3>
              </div>

              <div className="mt-4 bg-slate-100 p-4 rounded-2xl">
                <p className="font-semibold text-slate-900">
                  Order #INV-001
                </p>

                <span className="inline-block mt-2 bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm">
                  Diproses
                </span>
              </div>

              <div className="mt-4 bg-slate-100 p-4 rounded-2xl">
                <p className="font-semibold text-slate-900">
                  Order #INV-002
                </p>

                <span className="inline-block mt-2 bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-sm">
                  Selesai
                </span>
              </div>

              <div className="mt-4 bg-slate-100 p-4 rounded-2xl">
                <p className="font-semibold text-slate-900">
                  Customer Active
                </p>

                <h3 className="text-3xl font-black mt-2 text-slate-900">
                  145
                </h3>
              </div>
            </div>

            <div className="absolute -top-8 -right-4 text-6xl">
              🫧
            </div>

            <div className="absolute -bottom-6 left-0 text-5xl">
              ✨
            </div>
          </div>
        </div>
      </section>
            {/* FEATURES */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-28"
      >
        <div className="text-center">
          <span className="text-violet-600 font-semibold tracking-widest">
            FEATURES
          </span>

          <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
            Semua Yang Dibutuhkan
            <br />
            Laundry Modern
          </h2>

          <p className="text-slate-500 mt-6 max-w-2xl mx-auto">
            Dirancang untuk membantu kasir,
            pemilik laundry, dan pelanggan
            mendapatkan pengalaman yang lebih
            cepat dan nyaman.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[32px] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold mt-6 text-slate-900">
                {item.title}
              </h3>

              <p className="text-slate-500 mt-4 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-violet-600 font-semibold tracking-widest">
              HOW IT WORKS
            </span>

            <h2 className="text-4xl md:text-5xl font-black mt-4 text-slate-900">
              Cara Kerjanya
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-10 mt-20">
            {steps.map((step, index) => (
              <div
                key={step}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-lg">
                  {index + 1}
                </div>

                <h3 className="mt-6 font-semibold text-slate-900">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section
        id="tracking"
        className="max-w-6xl mx-auto px-6 py-28"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-violet-600 font-semibold tracking-widest">
              CUSTOMER EXPERIENCE
            </span>

            <h2 className="text-5xl font-black mt-4 text-slate-900">
              Pelanggan Tidak
              <br />
              Perlu Bertanya Lagi.
            </h2>

            <p className="text-slate-500 text-lg mt-6 leading-relaxed">
              Dengan fitur tracking realtime,
              pelanggan dapat melihat status
              laundry tanpa harus menghubungi
              kasir.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-10 shadow-xl">
            <p className="text-slate-500">
              Pesanan
            </p>

            <h3 className="text-3xl font-black mt-2 text-slate-900">
              #INV-001
            </h3>

            <div className="mt-10">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600"></div>

                <span className="font-medium text-slate-900">
                  Diproses
                </span>
              </div>

              <div className="ml-3 h-14 w-1 bg-violet-200"></div>

              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-cyan-500"></div>

                <span className="font-medium text-slate-900">
                  Selesai
                </span>
              </div>

              <div className="ml-3 h-14 w-1 bg-slate-200"></div>

              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-slate-300"></div>

                <span className="font-medium text-slate-900">
                  Diambil
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="max-w-6xl mx-auto px-6 pb-28"
      >
        <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-[40px] p-16 md:p-20 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black">
            Siap Mengelola Laundry
            <br />
            Lebih Modern?
          </h2>

          <p className="mt-6 text-white/90 max-w-2xl mx-auto">
            Digitalisasi operasional laundry
            dan berikan pengalaman terbaik
            untuk pelanggan.
          </p>

          <Link
            href="/login"
            className="inline-block bg-white text-slate-900 px-8 py-4 rounded-2xl mt-10 font-bold hover:scale-105 transition"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <h3 className="font-black text-2xl text-violet-600">
            🫧 WashFlow
          </h3>

          <p className="text-slate-500 mt-4 md:mt-0">
            © 2026 WashFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}