import { useState } from "react";
import { useGetMe } from "@workspace/api-client-react";
import { Eye, EyeOff, Key, User, Shield, Calendar } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";
import { format } from "date-fns";

export default function Account() {
  const { data: user } = useGetMe();
  const [showPw, setShowPw] = useState(false);

  const expired = user?.expiredAt
    ? (() => {
        const diff = Math.ceil((new Date(user.expiredAt).getTime() - Date.now()) / 86400000);
        return diff > 0 ? `${diff} Days` : "Expired";
      })()
    : "Permanent";

  return (
    <div className="relative min-h-full">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={baldwinImg} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/80 via-[#050d1f]/90 to-[#050d1f]" />
      </div>

      <div className="relative z-10">
        {/* Banner + avatar */}
        <div className="relative h-40 overflow-hidden">
          <img src={baldwinImg} alt="" className="w-full h-full object-cover object-top opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050d1f]/40 to-[#050d1f]" />
        </div>

        {/* Avatar floating */}
        <div className="flex flex-col items-center -mt-10 pb-2 relative z-10">
          <div className="w-20 h-20 rounded-full border-4 border-blue-500/60 overflow-hidden shadow-2xl shadow-blue-900/60">
            <img src={baldwinImg} alt="avatar" className="w-full h-full object-cover object-top" />
          </div>
          <p className="text-white font-bold text-lg mt-2">{user?.username}</p>
        </div>

        <div className="p-4 space-y-4 pb-8">
          {/* Account System card */}
          <div className="rounded-2xl bg-[#0a1428]/80 border border-blue-900/30 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-900/20">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Account System</p>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-blue-900/20">
              <AccountRow
                icon={<User className="w-4 h-4 text-blue-400" />}
                label="PENGGUNA"
                value={user?.username ?? "–"}
              />

              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">PASSWORD</p>
                  <p className="text-sm font-bold text-white font-mono">
                    {showPw ? "47146" : "•••••"}
                  </p>
                </div>
                <button onClick={() => setShowPw(p => !p)} className="text-slate-500 p-1">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AccountRow
                icon={<Shield className="w-4 h-4 text-blue-400" />}
                label="ROLE"
                value={user?.role ?? "–"}
                capitalize
                valueColor="text-blue-400"
              />

              <AccountRow
                icon={<Calendar className="w-4 h-4 text-blue-400" />}
                label="EXPIRED AKUN"
                value={expired}
              />
            </div>
          </div>

          {/* Account created info */}
          {user?.createdAt && (
            <div className="px-4 py-3 rounded-2xl bg-[#0a1428]/60 border border-blue-900/20 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Akun dibuat</p>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                {format(new Date(user.createdAt), "dd MMMM yyyy")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountRow({ icon, label, value, capitalize, valueColor = "text-white" }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className={`text-sm font-bold ${valueColor} ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
