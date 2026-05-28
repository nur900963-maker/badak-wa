import { Shield, Zap, Lock, AlertTriangle, CheckCircle, XCircle, MessageSquare, Clock, Eye, Wifi } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

const WHY_POINTS = [
  { icon: Shield,        color: "#3b82f6", title: "100% Anonim",          desc: "Nomer pengirim acak, ga ada jejak siapa yang ngirim. Target ga bisa balas balik." },
  { icon: Zap,           color: "#f59e0b", title: "Cepet & Massal",        desc: "Bisa kirim 100–500 chat sekaligus dalam hitungan menit. No manual, all auto." },
  { icon: Lock,          color: "#22c55e", title: "Ga Butuh Login WA",     desc: "Pake API third-party — nomer WA lo tetep aman, ga perlu connect akun sendiri." },
  { icon: Wifi,          color: "#a855f7", title: "4 Mode Pengiriman",     desc: "Aroxen (100), Travaz (150), Lochturn (200), Overhold (500). Pilih sesuai kebutuhan." },
  { icon: Eye,           color: "#ec4899", title: "Dashboard Real-time",   desc: "Pantau progress kiriman langsung dari app. Chat counter naik real-time." },
  { icon: Clock,         color: "#06b6d4", title: "Queue System",          desc: "Request antri otomatis. Ga ada yang nabrak, aman dan teratur." },
];

const DO_TIPS = [
  "Pakai delay — jangan kirim 500 chat sekaligus ke 1 nomer dalam waktu singkat.",
  "Ganti nomer target tiap sesi — jangan bombardir 1 nomer terus-terusan.",
  "Gunakan mode Aroxen (100 chat) untuk testing sebelum pakai Overhold (500 chat).",
  "Jeda minimal 10 menit antar request ke target yang sama.",
  "Pakai fitur ini untuk keperluan pribadi, bukan kriminal atau intimidasi.",
];

const DONT_TIPS = [
  "Jangan kirim ke nomer yang sama 3x berturut-turut dalam 1 jam.",
  "Hindari kata-kata yang memicu sistem spam detection WA (ancaman, SARA, dll).",
  "Jangan pakai di jaringan yang sama terus-terusan — sesekali ganti IP/network.",
  "Ga boleh share akun Vincent Badak ke orang lain — 1 akun 1 user.",
  "Dilarang keras buat nge-spam random nomer yang ga lo kenal buat tujuan scam.",
];

export default function About() {
  return (
    <div className="relative min-h-full">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={baldwinImg}
          alt=""
          className="w-full h-full object-cover object-top scale-105"
          style={{ filter: "brightness(0.3) blur(12px) saturate(1.3)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/70 via-[#050d1f]/85 to-[#050d1f]" />
        <div className="absolute inset-0 scanlines opacity-20" />
      </div>

      <div className="relative z-10 px-4 pb-8 space-y-6">
        {/* Hero card */}
        <div className="rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-900/40">
          <div className="relative h-36">
            <img
              src={baldwinImg}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.5) saturate(1.4)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1f] via-[#050d1f]/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">VINCENT BADAK</span>
              </div>
              <h1 className="text-xl font-black text-white leading-tight">Kenapa Harus<br />Pake APK Ini?</h1>
            </div>
          </div>
        </div>

        {/* Why use section */}
        <div>
          <SectionLabel label="Keunggulan" color="#3b82f6" />
          <div className="grid grid-cols-1 gap-3">
            {WHY_POINTS.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${p.color}10, ${p.color}05)`,
                  borderColor: `${p.color}30`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{ background: `${p.color}20`, boxShadow: `0 0 16px ${p.color}30` }}
                >
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-tight">{p.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to avoid ban */}
        <div>
          <SectionLabel label="Cara Biar Ga Kena Ban" color="#22c55e" />

          {/* DO */}
          <div className="rounded-2xl border border-green-900/30 bg-green-900/10 p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Yang Harus Dilakukan</p>
            </div>
            <div className="space-y-2.5">
              {DO_TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-black text-green-400">{i + 1}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DON'T */}
          <div className="rounded-2xl border border-red-900/30 bg-red-900/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Yang Harus Dihindari</p>
            </div>
            <div className="space-y-2.5">
              {DONT_TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="rounded-2xl border border-yellow-900/30 bg-yellow-900/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-400 mb-1">DISCLAIMER</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Penggunaan di luar keperluan yang diizinkan sepenuhnya menjadi tanggung jawab pengguna. Developer tidak bertanggung jawab atas penyalahgunaan.
              </p>
            </div>
          </div>
        </div>

        {/* Dev contact */}
        <div className="rounded-2xl border border-blue-900/30 bg-[#0a1428]/60 p-4 text-center backdrop-blur-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Developer</p>
          <p className="text-sm font-bold text-white">@pakvncnt</p>
          <p className="text-[11px] text-blue-400 mt-0.5">Channel: @testipakvncnt</p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <p className="text-xs font-black text-white uppercase tracking-widest">{label}</p>
    </div>
  );
}
