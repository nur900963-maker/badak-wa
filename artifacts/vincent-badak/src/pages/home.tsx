import { useGetMe, useGetStats, useListNews } from "@workspace/api-client-react";
import { Users, Link as LinkIcon, LayoutGrid } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";
import { format } from "date-fns";

export default function Home() {
  const { data: user } = useGetMe();
  const { data: stats } = useGetStats();
  const { data: news } = useListNews();

  const expired = user?.expiredAt
    ? (() => {
        const diff = Math.ceil((new Date(user.expiredAt).getTime() - Date.now()) / 86400000);
        return diff > 0 ? `${diff} Days` : "Expired";
      })()
    : "Permanent";

  return (
    <div className="relative min-h-full">
      {/* Blurred BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={baldwinImg} alt="" className="w-full h-full object-cover object-center opacity-15 blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/80 via-[#050d1f]/90 to-[#050d1f]" />
      </div>

      <div className="relative z-10 p-4 space-y-5 pb-6">

        {/* Welcome Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-600/90 to-blue-900/90 border border-blue-500/30 shadow-lg shadow-blue-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Welcome Back</p>
              <h2 className="text-sm font-black text-white leading-tight">VINCENT BADAK DASHBOARD</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 text-blue-200 text-[10px] uppercase font-semibold mb-1">
                <Users className="w-3 h-3" /> Online Users
              </div>
              <p className="text-2xl font-black text-white">{stats?.onlineUsers ?? 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 text-blue-200 text-[10px] uppercase font-semibold mb-1">
                <LinkIcon className="w-3 h-3" /> Connections
              </div>
              <p className="text-2xl font-black text-white">{stats?.totalMembers ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Latest News</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {news?.length ? news.slice(0, 5).map((n) => (
              <div key={n.id} className="snap-start shrink-0 w-52 rounded-2xl overflow-hidden border border-blue-900/40 bg-gradient-to-b from-blue-900/60 to-[#050d1f]/80">
                <div className="h-28 overflow-hidden relative">
                  <img src={baldwinImg} alt="" className="w-full h-full object-cover object-top opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050d1f] to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-xs font-bold text-white line-clamp-1">{n.title}</p>
                    <p className="text-[10px] text-blue-300 line-clamp-1 mt-0.5">{n.content}</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-[10px] text-slate-500">{format(new Date(n.createdAt), "dd MMM yyyy")}</p>
                </div>
              </div>
            )) : (
              <div className="w-52 h-32 rounded-2xl bg-blue-900/20 border border-blue-900/30 flex items-center justify-center">
                <p className="text-xs text-slate-500">No news yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Account Info</h3>
          </div>
          <div className="bg-[#0a1428]/80 border border-blue-900/30 border-t-0 rounded-b-2xl divide-y divide-blue-900/20">
            <InfoRow icon="👤" label="Username" value={user?.username ?? "–"} />
            <InfoRow icon="🛡️" label="Role" value={user?.role ?? "–"} color="text-blue-400" capitalize />
            <InfoRow icon="📅" label="Expired" value={expired} />
            <InfoRow icon="👥" label="Total Members" value={String(stats?.totalMembers ?? 0)} />
            <InfoRow icon="⚡" label="Active Requests" value={String(stats?.activeRequests ?? 0)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, color = "text-white", capitalize }: { icon: string; label: string; value: string; color?: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-base w-6 text-center">{icon}</span>
      <div className="flex-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm font-bold mt-0.5 ${color} ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
