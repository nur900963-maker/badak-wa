import { useGetMe, useGetStats, useListNews } from "@workspace/api-client-react";
import { Users, Link as LinkIcon, LayoutGrid, ExternalLink } from "lucide-react";
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
      {/* Full HD background — Baldwin image prominent */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={baldwinImg}
          alt=""
          className="w-full h-full object-cover object-center opacity-40 scale-105"
          style={{ filter: "blur(8px) brightness(0.6)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/60 via-[#050d1f]/75 to-[#050d1f]/95" />
        {/* subtle horizontal light sweep */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 p-4 space-y-5 pb-6">

        {/* Dev contact button — top right */}
        <div className="flex justify-end">
          <a
            href="https://t.me/testipakvncnt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[11px] font-semibold shadow-sm hover:bg-blue-600/30 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            @pakvncnt
          </a>
        </div>

        {/* Welcome Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-600/80 to-blue-900/80 border border-blue-500/30 shadow-xl shadow-blue-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Welcome Back</p>
              <h2 className="text-sm font-black text-white leading-tight">VINCENT BADAK DASHBOARD</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-blue-200 text-[10px] uppercase font-semibold mb-1">
                <Users className="w-3 h-3" /> Online Users
              </div>
              <p className="text-2xl font-black text-white">{stats?.onlineUsers ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
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
            <div className="w-1 h-5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Latest News</h3>
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {news?.length ? (
              news.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className="snap-start shrink-0 w-52 rounded-2xl overflow-hidden border border-blue-900/40 bg-[#0a1428]/60 backdrop-blur-sm shadow-lg"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img
                      src={baldwinImg}
                      alt=""
                      className="w-full h-full object-cover object-center"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d1f] via-[#050d1f]/40 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-xs font-bold text-white line-clamp-1 drop-shadow">{n.title}</p>
                      <p className="text-[10px] text-blue-200 line-clamp-1 mt-0.5 drop-shadow">{n.content}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[10px] text-slate-500">{format(new Date(n.createdAt), "dd MMM yyyy")}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-28 rounded-2xl bg-blue-900/20 border border-blue-900/30 flex items-center justify-center">
                <p className="text-xs text-slate-500">Belum ada berita</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl overflow-hidden border border-blue-900/30 shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Account Info</h3>
          </div>
          <div className="bg-[#0a1428]/80 backdrop-blur-sm divide-y divide-blue-900/20">
            <InfoRow label="Username" value={user?.username ?? "–"} />
            <InfoRow label="Role" value={user?.role ?? "–"} capitalize color="text-blue-400" />
            <InfoRow label="Expired" value={expired} />
            <InfoRow label="Total Members" value={String((stats?.totalMembers ?? 0) + (stats?.totalResellers ?? 0))} />
            <InfoRow label="Active Requests" value={String(stats?.activeRequests ?? 0)} />
          </div>
        </div>

        {/* Dev contact card */}
        <div className="rounded-2xl bg-[#0a1428]/70 border border-blue-900/30 p-4 backdrop-blur-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3">Kontak Developer</p>
          <div className="flex flex-col gap-2">
            <a
              href="https://t.me/pakvncnt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-200 text-sm font-semibold hover:bg-blue-600/30 transition-colors"
            >
              <span>@pakvncnt</span>
              <span className="text-[10px] text-blue-400 font-normal">Developer</span>
            </a>
            <a
              href="https://t.me/testipakvncnt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-900/30 text-blue-300 text-sm font-semibold hover:bg-blue-600/20 transition-colors"
            >
              <span>@testipakvncnt</span>
              <span className="text-[10px] text-blue-500 font-normal flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> My Channel
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color = "text-white", capitalize }: {
  label: string; value: string; color?: string; capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-bold ${color} ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
