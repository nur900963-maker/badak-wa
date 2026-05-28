import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare, Unlock, Signal, Activity, Phone, X, Bell, Eye, EyeOff,
  Camera, Mail, MapPin, Wifi, Clipboard, Grid, Clock, Radio, Folder,
  Contact, PhoneCall, BellRing, Settings2, Settings, Layers, Database,
} from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

type Step = "idle" | "input" | "progress" | "result";

interface ModalState {
  open: boolean;
  toolId: string | null;
  step: Step;
  progress: number;
  input: string;
  result: string | null;
  noInput?: boolean;
}

/* ---- Main tools (2-col, larger cards) ---- */
const MAIN_TOOLS = [
  { id: "wa",       title: "Badak WA",       desc: "WhatsApp Tool",      icon: MessageSquare, c: "#3b82f6", bg: "rgba(59,130,246,0.18)", link: "/whatsapp" },
  { id: "unband",   title: "Unband WA",       desc: "Bypass Restrictions",icon: Unlock,        c: "#22c55e", bg: "rgba(34,197,94,0.18)" },
  { id: "provider", title: "Cek Provider",    desc: "Check HLR",         icon: Signal,        c: "#a855f7", bg: "rgba(168,85,247,0.18)" },
  { id: "umur",     title: "Cek Umur Kartu",  desc: "Simcard Age",       icon: Activity,      c: "#a855f7", bg: "rgba(168,85,247,0.18)" },
  { id: "ngl",      title: "Spam NGL",        desc: "Anon Message",      icon: MessageSquare, c: "#ec4899", bg: "rgba(236,72,153,0.18)" },
  { id: "nomor",    title: "Cek Nomor",       desc: "Number Info",       icon: Phone,         c: "#f97316", bg: "rgba(249,115,22,0.18)" },
];

/* ---- Mini tools (4-col, small icon cards) ---- */
const MINI_TOOLS = [
  { id: "kamera",     label: "Kamera",       icon: Camera,    c: "#ef4444" },
  { id: "sms_baru",   label: "Sms Baru",     icon: Mail,      c: "#ef4444" },
  { id: "sms_lama",   label: "Sms Lama",     icon: Mail,      c: "#f97316" },
  { id: "kontak",     label: "Kontak",       icon: Contact,   c: "#22c55e" },
  { id: "panggilan",  label: "Panggilan",    icon: PhoneCall, c: "#f59e0b" },
  { id: "sistem",     label: "Sistem",       icon: Settings2, c: "#6366f1" },
  { id: "gmail",      label: "Gmail",        icon: Mail,      c: "#ef4444" },
  { id: "lokasi",     label: "Lokasi",       icon: MapPin,    c: "#f97316" },
  { id: "jaringan",   label: "Jaringan",     icon: Wifi,      c: "#f59e0b" },
  { id: "notif",      label: "Notifikasi",   icon: BellRing,  c: "#22c55e" },
  { id: "clipboard",  label: "Clipboard",    icon: Clipboard, c: "#3b82f6" },
  { id: "aplikasi",   label: "Aplikasi",     icon: Grid,      c: "#a855f7" },
  { id: "payload",    label: "Akses payload", icon: Layers,   c: "#f59e0b" },
  { id: "celltower",  label: "Cell Tower",   icon: Radio,     c: "#8b5cf6" },
  { id: "wifiscan",   label: "WiFi Scan",    icon: Wifi,      c: "#3b82f6" },
  { id: "wifihistory",label: "WiFi History", icon: Clock,     c: "#06b6d4" },
  { id: "filemanager",label: "File Manager", icon: Folder,    c: "#ef4444" },
  { id: "db",         label: "Database",     icon: Database,  c: "#a855f7" },
];

/* ---- Fake results per tool ---- */
const FAKE_RESULTS: Record<string, string> = {
  provider:    "Provider: Telkomsel\nHLR Status: Active\nIMSI: 510100812xxxxx\nRegion: DKI Jakarta",
  umur:        "Usia Kartu: 3 Tahun 4 Bulan 12 Hari\nPertama Aktif: 14 Januari 2022\nStatus: Aktif",
  nomor:       "Status: Aktif\nTerdaftar: Ya\nRegion: Jabodetabek\nTipe: Pascabayar",
  unband:      "Permintaan Unban dikirim ke WA Support.\nETA: 24-48 jam\nTicket ID: #WA-2026-887432",
  ngl:         "500 pesan terkirim ke NGL link.\nSemua terkirim secara anonim.\nDelay: 0.8s/msg",
  kamera:      "[ KAMERA SIMULASI ]\nResolusi: 64MP / 12MP Front\nFPS: 60\nStatus: Standby\nFlash: Tersedia",
  sms_baru:    "[ 3 SMS BARU ]\n+6281234xxxxx: 'Kode OTP Anda: 847291'\n+6285678xxxxx: 'Promo akhir tahun...'\n+6281900xxxxx: 'Tagihan bulan ini...'",
  sms_lama:    "[ 127 SMS LAMA ]\n+6282111xxxxx: 'Selamat datang di...'\n+6281300xxxxx: 'Transaksi berhasil Rp 150.000'\nDan 125 pesan lainnya...",
  kontak:      "[ 342 KONTAK ]\nMama: +62812xxxxxxx\nPapa: +62813xxxxxxx\nBos: +62877xxxxxxx\n...",
  panggilan:   "[ LOG PANGGILAN ]\n+62812xxx (Masuk, 12m)\n+62877xxx (Keluar, 3m)\n+62813xxx (Tidak diangkat)\n...",
  sistem:      "[ INFO SISTEM ]\nModel: Realme C55\nAndroid: 13\nRAM: 6/8 GB\nStorage: 44/128 GB\nBaterai: 67%",
  gmail:       "[ 5 EMAIL BARU ]\nGoogle: Aktivitas login baru...\nShopee: Paket kamu tiba...\nGofood: Pesananmu selesai...",
  lokasi:      "[ GPS LOKASI ]\nLat: -6.2088° S\nLon: 106.8456° E\nAlamat: Jl. Sudirman, Jakarta Selatan\nAkurasi: ±5m",
  jaringan:    "[ JARINGAN ]\nSSID: HomeWiFi_2.4G\nIP: 192.168.1.105\nDNS: 8.8.8.8\nKecepatan: 45.2 Mbps",
  notif:       "[ 12 NOTIFIKASI ]\nWhatsApp: 5 pesan baru\nInstagram: 3 like baru\nGojek: Driver menuju lokasi\n...",
  clipboard:   "[ CLIPBOARD ]\nTerakhir disalin:\n'Kode OTP: 847291'\n\nRiwayat (3):\n'Transfer 150rb'\n'Password123!'\n...",
  aplikasi:    "[ 89 APLIKASI ]\nWhatsApp v2.24.7\nInstagram v310.0\nTikTok v33.4.1\nGojek v4.58.2\n...",
  payload:     "[ PAYLOAD INJECTED ]\nStatus: Berhasil\nTarget: com.android.settings\nVector: Intent Overflow\nPersistence: ON",
  celltower:   "[ CELL TOWER ]\nMNC: 01 (Telkomsel)\nLAC: 4231\nCell ID: 72183\nSignal: -78 dBm (Baik)",
  wifiscan:    "[ 8 JARINGAN WIFI ]\nHomeWiFi_2.4G (-42dBm) WPA3\nTetangga_5G (-61dBm) WPA2\nIndomaret_Free (-73dBm) OPEN\n...",
  wifihistory: "[ RIWAYAT WIFI ]\nHomeWiFi_2.4G (Terhubung 1247x)\nKantor_Wifi (Terhubung 234x)\nCafe_Guest (Terhubung 12x)\n...",
  filemanager: "[ FILE MANAGER ]\n/DCIM/Camera (1.2GB, 342 file)\n/Download (678MB, 89 file)\n/WhatsApp/Media (2.3GB)\n...",
  db:          "[ DATABASE ]\nKontak: 342\nSMS: 1.287\nRiwayat: 892 item\nCache: 234MB\nCookies: 47 domain",
};

const NEEDS_INPUT = new Set(["provider","umur","nomor","unband","ngl","wa"]);

export default function Tools() {
  const { data: user } = useGetMe();
  const [showPw, setShowPw] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [modal, setModal] = useState<ModalState>({
    open: false, toolId: null, step: "idle", progress: 0, input: "", result: null,
  });

  const expired = user?.expiredAt
    ? (() => {
        const diff = Math.ceil((new Date(user.expiredAt).getTime() - Date.now()) / 86400000);
        return diff > 0 ? `${diff} Days` : "Expired";
      })()
    : "30 Days";

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const openTool = (id: string) => {
    clearTimer();
    const noInput = !NEEDS_INPUT.has(id);
    setModal({ open: true, toolId: id, step: noInput ? "progress" : "input", progress: 0, input: "", result: null, noInput });
    if (noInput) startProgress(id);
  };

  const startProgress = (id: string) => {
    clearTimer();
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.floor(Math.random() * 22) + 6;
      if (p >= 100) {
        clearTimer();
        setModal(prev => ({ ...prev, step: "result", progress: 100, result: FAKE_RESULTS[id] ?? "Berhasil dieksekusi." }));
      } else {
        setModal(prev => ({ ...prev, progress: Math.min(p, 99) }));
      }
    }, 350);
  };

  const executeTool = () => {
    const id = modal.toolId!;
    if (NEEDS_INPUT.has(id) && !modal.input.trim()) return;
    setModal(prev => ({ ...prev, step: "progress", progress: 0 }));
    startProgress(id);
  };

  const closeTool = () => { clearTimer(); setModal(prev => ({ ...prev, open: false })); };

  const mainTool = MAIN_TOOLS.find(t => t.id === modal.toolId);
  const miniTool = MINI_TOOLS.find(t => t.id === modal.toolId);
  const activeTool = mainTool ?? miniTool;

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Glitchy textured background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={baldwinImg} alt="" className="w-full h-full object-cover opacity-30 blur-[3px] scale-105" />
        <div className="absolute inset-0 bg-[#050d1f]/75" />
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines" />
      </div>

      <div className="relative z-10 pb-6">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h1 className="text-sm font-black text-white uppercase tracking-widest">VINCENT<span className="text-blue-400">NOTDEV</span></h1>
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-medium"
          >
            <Settings className="w-3 h-3" /> Profile
          </button>
        </div>

        {/* Main tools section */}
        <div className="px-3 mb-4">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2 px-1">— Main Tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {MAIN_TOOLS.map(tool =>
              tool.link ? (
                <Link key={tool.id} href={tool.link}>
                  <MainToolCard tool={tool} />
                </Link>
              ) : (
                <div key={tool.id} onClick={() => openTool(tool.id)}>
                  <MainToolCard tool={tool} />
                </div>
              )
            )}
          </div>
        </div>

        {/* Mini tools section — 4 col */}
        <div className="px-3">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2 px-1">— Extended Tools</p>
          <div className="grid grid-cols-4 gap-2">
            {MINI_TOOLS.map(tool => (
              <div key={tool.id} onClick={() => openTool(tool.id)}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-[#0a1428]/70 border border-blue-900/30 active:scale-95 transition-transform cursor-pointer hover:border-blue-500/40">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${tool.c}22` }}>
                  <tool.icon className="w-5 h-5" style={{ color: tool.c }} />
                </div>
                <span className="text-[9px] text-slate-300 font-medium text-center leading-tight px-1">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool execution dialog */}
      <Dialog open={modal.open} onOpenChange={o => { if (!o) closeTool(); }}>
        <DialogContent className="bg-[#0a1428] border border-blue-900/40 w-[90%] max-w-[380px] rounded-2xl p-0 overflow-hidden gap-0">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-900/30">
            <div className="flex items-center gap-2.5">
              {activeTool && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${'c' in activeTool ? activeTool.c : (activeTool as typeof MAIN_TOOLS[0]).c}22` }}>
                  <activeTool.icon className="w-4 h-4" style={{ color: 'c' in activeTool ? activeTool.c : (activeTool as typeof MAIN_TOOLS[0]).c }} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{'title' in (activeTool ?? {}) ? (activeTool as typeof MAIN_TOOLS[0]).title : (activeTool as typeof MINI_TOOLS[0])?.label}</p>
                <p className="text-[10px] text-slate-500">{'desc' in (activeTool ?? {}) ? (activeTool as typeof MAIN_TOOLS[0]).desc : "Vincent Badak Tool"}</p>
              </div>
            </div>
            <button onClick={closeTool} className="text-slate-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {modal.step === "input" && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] text-blue-300 uppercase font-bold tracking-widest">
                    {modal.toolId === "ngl" ? "NGL Username" : "Target Number"}
                  </label>
                  <Input
                    placeholder={modal.toolId === "ngl" ? "@username" : "628xxxxxxxxxx"}
                    className="bg-[#050d1f] border-blue-900/40 text-white rounded-xl h-11 font-mono placeholder:text-slate-700"
                    value={modal.input}
                    onChange={e => setModal(prev => ({ ...prev, input: e.target.value }))}
                  />
                </div>
                <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white border-0" onClick={executeTool}>
                  Execute Tool
                </Button>
              </>
            )}

            {modal.step === "progress" && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white animate-pulse uppercase tracking-widest">Memproses...</p>
                  <p className="text-[10px] text-slate-500 font-mono">Connecting to target system...</p>
                </div>
                <Progress value={modal.progress} className="h-1.5 rounded-full" />
                <p className="text-xs text-blue-400 font-mono font-bold">{modal.progress}%</p>
              </div>
            )}

            {modal.step === "result" && (
              <div className="space-y-3">
                <div className="p-4 bg-[#050d1f] border border-green-900/40 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider">Output Berhasil</p>
                  </div>
                  <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap leading-relaxed">{modal.result}</pre>
                </div>
                <Button variant="outline" className="w-full rounded-xl border-blue-900/40 text-slate-300 font-bold" onClick={closeTool}>
                  Tutup
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Card dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="bg-[#0a1428] border border-blue-900/40 w-[90%] max-w-[380px] rounded-2xl p-0 overflow-hidden gap-0">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-900/30">
            <div>
              <p className="text-sm font-bold text-white">Profile Card</p>
              <p className="text-[10px] text-slate-500">User Configuration</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-[#050d1f] border border-blue-900/40 flex items-center justify-center text-slate-400">
                <Bell className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setProfileOpen(false)} className="w-8 h-8 rounded-full bg-[#050d1f] border border-blue-900/40 flex items-center justify-center text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="h-24 overflow-hidden relative">
            <img src={baldwinImg} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1428]/90" />
          </div>
          <div className="mx-4 mt-3 mb-2 rounded-xl bg-[#050d1f] border border-blue-900/30 p-4 space-y-2 font-mono text-sm">
            <TermLine prefix=">_" label="username" value={user?.username ?? "admin"} color="text-cyan-300" />
            <div className="flex items-center gap-2">
              <span className="text-slate-600">🔑</span>
              <span className="text-slate-400 text-xs">const</span>
              <span className="text-white text-xs">password</span>
              <span className="text-slate-400 text-xs">:</span>
              <span className="text-cyan-300 text-xs flex items-center gap-1">
                {showPw ? "47146" : "•••••"}
                <button onClick={() => setShowPw(p => !p)} className="text-slate-600 ml-1">
                  {showPw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <TermLine prefix="🛡️" label="role" value={user?.role ?? "admin"} color="text-blue-400" />
            <TermLine prefix="📅" label="expired" value={expired} color="text-cyan-300" />
          </div>
          <div className="px-4 pb-4">
            <button className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm">
              Change Password
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TermLine({ prefix, label, value, color }: { prefix: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-600 text-xs">{prefix}</span>
      <span className="text-slate-400 text-xs">const</span>
      <span className="text-white text-xs">{label}</span>
      <span className="text-slate-400 text-xs">:</span>
      <span className={`text-xs ${color}`}>{value};</span>
    </div>
  );
}

function MainToolCard({ tool }: { tool: typeof MAIN_TOOLS[0] }) {
  return (
    <div className="rounded-2xl p-4 bg-[#0a1428]/80 border border-blue-900/30 hover:border-blue-500/40 active:scale-95 transition-all cursor-pointer">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5" style={{ background: tool.bg }}>
        <tool.icon className="w-5 h-5" style={{ color: tool.c }} />
      </div>
      <p className="text-sm font-bold text-white leading-tight">{tool.title}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{tool.desc}</p>
    </div>
  );
}
