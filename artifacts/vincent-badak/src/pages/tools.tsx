import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Unlock, Signal, Activity, Phone, X, Bell, Eye, EyeOff, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetMe } from "@workspace/api-client-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

type Step = "input" | "progress" | "result";

interface ModalState {
  open: boolean;
  toolId: string | null;
  step: Step;
  progress: number;
  input: string;
  result: string | null;
}

const TOOLS = [
  { id: "wa", title: "Badak WA", desc: "WhatsApp Attack Tool", icon: MessageSquare, iconColor: "#3b82f6", iconBg: "rgba(59,130,246,0.15)", link: "/whatsapp" },
  { id: "unband", title: "Unband WA", desc: "Bypass Restrictions", icon: Unlock, iconColor: "#22c55e", iconBg: "rgba(34,197,94,0.15)" },
  { id: "provider", title: "Cek Provider", desc: "Check HLR Provider", icon: Signal, iconColor: "#a855f7", iconBg: "rgba(168,85,247,0.15)" },
  { id: "umur", title: "Cek Umur Kartu", desc: "Simcard Age Checker", icon: Activity, iconColor: "#a855f7", iconBg: "rgba(168,85,247,0.15)" },
  { id: "ngl", title: "Spam NGL", desc: "Anonymous Message", icon: MessageSquare, iconColor: "#ec4899", iconBg: "rgba(236,72,153,0.15)" },
  { id: "nomor", title: "Cek Nomor", desc: "Number Information", icon: Phone, iconColor: "#f97316", iconBg: "rgba(249,115,22,0.15)" },
];

const RESULTS: Record<string, string> = {
  provider: "Telkomsel - Jakarta (0812)\nHLR: Active | IMSI: 510100xxx",
  umur: "3 Years, 4 Months, 12 Days Active\nFirst Active: 2022-01-14",
  nomor: "Status: Active\nRegistered: Yes\nRegion: Jabodetabek",
  unband: "Unban request submitted to WA Support.\nETA: 24-48 hours",
  ngl: "500 messages sent successfully.\nAll delivered anonymously.",
  wa: "Request queued successfully.",
};

export default function Tools() {
  const { toast } = useToast();
  const { data: user } = useGetMe();
  const [showPw, setShowPw] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [modal, setModal] = useState<ModalState>({
    open: false, toolId: null, step: "input", progress: 0, input: "", result: null,
  });

  const expired = user?.expiredAt
    ? (() => {
        const diff = Math.ceil((new Date(user.expiredAt).getTime() - Date.now()) / 86400000);
        return diff > 0 ? `${diff} Days` : "Expired";
      })()
    : "30 Days";

  const openTool = (id: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setModal({ open: true, toolId: id, step: "input", progress: 0, input: "", result: null });
  };

  const closeTool = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setModal(prev => ({ ...prev, open: false }));
  };

  const executeTool = () => {
    if (!modal.input.trim()) {
      toast({ title: "Input Required", description: "Isi field terlebih dahulu.", variant: "destructive" });
      return;
    }

    const toolId = modal.toolId!;
    if (timerRef.current) clearInterval(timerRef.current);

    setModal(prev => ({ ...prev, step: "progress", progress: 0 }));

    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.floor(Math.random() * 25) + 8;
      if (p >= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setModal(prev => ({ ...prev, step: "result", progress: 100, result: RESULTS[toolId] ?? "Success" }));
      } else {
        setModal(prev => ({ ...prev, progress: Math.min(p, 99) }));
      }
    }, 400);
  };

  const activeTool = TOOLS.find(t => t.id === modal.toolId);

  return (
    <div className="relative min-h-full">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={baldwinImg} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/85 via-[#050d1f]/90 to-[#050d1f]" />
      </div>

      <div className="relative z-10 p-4 space-y-3 pb-6">
        {/* Profile Card trigger */}
        <div className="flex justify-end">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium"
          >
            <Settings className="w-3.5 h-3.5" /> Profile Card
          </button>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map(tool =>
            tool.link ? (
              <Link key={tool.id} href={tool.link}>
                <ToolCard tool={tool} />
              </Link>
            ) : (
              <div key={tool.id} onClick={() => openTool(tool.id)}>
                <ToolCard tool={tool} />
              </div>
            )
          )}
        </div>
      </div>

      {/* Tool execution dialog */}
      <Dialog open={modal.open} onOpenChange={(o) => { if (!o) closeTool(); }}>
        <DialogContent className="bg-[#0a1428] border border-blue-900/40 w-[90%] max-w-[380px] rounded-2xl p-0 overflow-hidden gap-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-blue-900/30">
            <div className="flex items-center gap-2">
              {activeTool && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: activeTool.iconBg }}>
                  <activeTool.icon className="w-4 h-4" style={{ color: activeTool.iconColor }} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{activeTool?.title}</p>
                <p className="text-[10px] text-slate-500">{activeTool?.desc}</p>
              </div>
            </div>
            <button onClick={closeTool} className="text-slate-500 hover:text-white">
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
                <Button
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white border-0"
                  onClick={executeTool}
                >
                  Execute Tool
                </Button>
              </>
            )}

            {modal.step === "progress" && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-sm font-bold text-white animate-pulse uppercase tracking-widest">Processing...</p>
                <Progress value={modal.progress} className="h-2 rounded-full" />
                <p className="text-xs text-slate-500 font-mono">{modal.progress}%</p>
              </div>
            )}

            {modal.step === "result" && (
              <div className="space-y-4">
                <div className="p-4 bg-[#050d1f] border border-green-900/40 rounded-xl">
                  <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider mb-2">Result Output</p>
                  <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{modal.result}</pre>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-blue-900/40 text-slate-300 font-bold"
                  onClick={closeTool}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Card dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="bg-[#0a1428] border border-blue-900/40 w-[90%] max-w-[380px] rounded-2xl p-0 overflow-hidden gap-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-blue-900/30">
            <div>
              <p className="text-sm font-bold text-white">Profile Card</p>
              <p className="text-[10px] text-slate-500">User Configuration</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-[#050d1f] border border-blue-900/40 flex items-center justify-center text-slate-400">
                <Bell className="w-4 h-4" />
              </button>
              <button onClick={() => setProfileOpen(false)} className="w-8 h-8 rounded-full bg-[#050d1f] border border-blue-900/40 flex items-center justify-center text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="h-28 overflow-hidden relative">
            <img src={baldwinImg} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1428]/80" />
          </div>

          {/* Terminal style user info */}
          <div className="mx-4 mt-3 mb-2 rounded-xl bg-[#050d1f] border border-blue-900/30 p-4 space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">&gt;_</span>
              <span className="text-slate-400">const</span>
              <span className="text-white">username</span>
              <span className="text-slate-400">:</span>
              <span className="text-cyan-300">{user?.username};</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">🔑</span>
              <span className="text-slate-400">const</span>
              <span className="text-white">password</span>
              <span className="text-slate-400">:</span>
              <span className="text-cyan-300 flex items-center gap-1">
                {showPw ? "47146" : "•••••"}
                <button onClick={() => setShowPw(p => !p)} className="text-slate-600 ml-1">
                  {showPw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">🛡️</span>
              <span className="text-slate-400">const</span>
              <span className="text-white">role</span>
              <span className="text-slate-400">:</span>
              <span className="text-blue-400 capitalize">{user?.role};</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">📅</span>
              <span className="text-slate-400">const</span>
              <span className="text-white">expired</span>
              <span className="text-slate-400">:</span>
              <span className="text-cyan-300">{expired};</span>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm tracking-wide">
              Change Password
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolCard({ tool }: { tool: typeof TOOLS[0] }) {
  return (
    <div className="rounded-2xl p-4 bg-[#0a1428]/80 border border-blue-900/30 hover:border-blue-500/40 transition-colors cursor-pointer active:scale-95 transition-transform">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: tool.iconBg }}>
        <tool.icon className="w-6 h-6" style={{ color: tool.iconColor }} />
      </div>
      <p className="text-sm font-bold text-white leading-tight">{tool.title}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{tool.desc}</p>
    </div>
  );
}
