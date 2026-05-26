import { useGetMe, useGetStats, useListNews } from "@workspace/api-client-react";
import { Users, Activity, MessageSquare, ExternalLink, TrendingUp, Cpu, Star } from "lucide-react";
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
      {/* Full-screen Baldwin background — more vivid & visible */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={baldwinImg}
          alt=""
          className="w-full h-full object-cover object-center scale-110"
          style={{ filter: "brightness(0.45) saturate(1.3) blur(4px)" }}
        />
        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/40 via-[#050d1f]/70 to-[#050d1f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 scanlines opacity-25" />
      </div>

      <div className="relative z-10 pb-6">
        {/* Top hero strip — Baldwin visible, name + role */}
        <div className="relative overflow-hidden h-52">
          <img
            src={baldwinImg}
            alt=""
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.55) saturate(1.3)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#050d1f]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050d1f] via-transparent to-transparent" />

          {/* Top right — contact dev button */}
          <div className="absolute top-4 right-4">
            <a
              href="https://t.me/testipakvncnt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "rgba(59,130,246,0.35)", border: "1px solid rgba(59,130,246,0.4)", backdropFilter: "blur(8px)" }}
            >
              <ExternalLink className="w-3 h-3" />
              @pakvncnt
            </a>
          </div>

          {/* Bottom of hero — user info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-blue-300 uppercase tracking-[3px] font-bold mb-0.5">Welcome Back</p>
                <h1 className="text-xl font-black text-white leading-none">{user?.username?.toUpperCase()}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize"
                    style={{ background: "rgba(59,130,246,0.25)", border: "1px solid rgba(59,130,246,0.4)", color: "#93c5fd" }}>
                    {user?.role}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)", color: "#fbbf24" }}>
                    {expired}
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-400/60 shadow-xl shadow-blue-900/60">
                <img src={baldwinImg} alt="" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-5 -mt-2">
          {/* Stats grid — 3 cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <StatCard
              icon={<Users className="w-4 h-4" />}
              value={stats?.onlineUsers ?? 0}
              label="Online"
              color="#3b82f6"
              glow
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              value={(stats?.totalMembers ?? 0) + (stats?.totalResellers ?? 0)}
              label="Members"
              color="#22c55e"
            />
            <StatCard
              icon={<Activity className="w-4 h-4" />}
              value={stats?.activeRequests ?? 0}
              label="Requests"
              color="#f59e0b"
            />
          </div>

          {/* Feature highlight strip */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { icon: <MessageSquare className="w-3.5 h-3.5" />, text: "100–500 Chat", color: "#3b82f6" },
              { icon: <Cpu className="w-3.5 h-3.5" />,           text: "4 Methods",   color: "#a855f7" },
              { icon: <Star className="w-3.5 h-3.5" />,          text: "Anonymous",   color: "#f59e0b" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-[10px] font-bold"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                  color: f.color,
                }}
              >
                {f.icon}
                {f.text}
              </div>
            ))}
          </div>

          {/* Latest News */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-400" style={{ boxShadow: "0 0 8px #3b82f6" }} />
              <h2 className="text-xs font-black text-white uppercase tracking-[3px]">Latest News</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
              {news?.length ? (
                news.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className="snap-start shrink-0 w-52 rounded-2xl overflow-hidden shadow-lg"
                    style={{ background: "rgba(10,20,40,0.7)", border: "1px solid rgba(59,130,246,0.2)", backdropFilter: "blur(8px)" }}
                  >
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src={baldwinImg}
                        alt=""
                        className="w-full h-full object-cover object-center"
                        style={{ filter: "brightness(0.6) saturate(1.3)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050d1f] via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-xs font-bold text-white line-clamp-1">{n.title}</p>
                      </div>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{n.content}</p>
                      <p className="text-[9px] text-slate-600 mt-1">{format(new Date(n.createdAt), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-24 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <p className="text-xs text-slate-500">Belum ada berita</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Info Card */}
          <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.8), rgba(17,24,39,0.9))" }}>
              <Users className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Account Info</span>
            </div>
            <div style={{ background: "rgba(10,20,40,0.8)", backdropFilter: "blur(8px)" }}>
              <InfoRow label="Username" value={user?.username ?? "–"} />
              <InfoRow label="Role" value={user?.role ?? "–"} capitalize accent />
              <InfoRow label="Expired" value={expired} />
              <InfoRow label="Total Members" value={String((stats?.totalMembers ?? 0) + (stats?.totalResellers ?? 0))} />
              <InfoRow label="Active Requests" value={String(stats?.activeRequests ?? 0)} highlight={!!stats?.activeRequests} />
            </div>
          </div>

          {/* Dev contact */}
          <div className="rounded-2xl p-4 space-y-2"
            style={{ background: "rgba(10,20,40,0.6)", border: "1px solid rgba(59,130,246,0.15)", backdropFilter: "blur(8px)" }}>
            <p className="text-[9px] text-slate-600 uppercase tracking-[3px] font-bold mb-3">Kontak Developer</p>
            {[
              { href: "https://t.me/pakvncnt",     label: "@pakvncnt",     sub: "Developer", color: "#3b82f6" },
              { href: "https://t.me/testipakvncnt", label: "@testipakvncnt", sub: "Channel",   color: "#6366f1" },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-98"
                style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}
              >
                <span className="text-sm font-bold" style={{ color: c.color }}>{c.label}</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {c.sub}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, glow }: {
  icon: React.ReactNode; value: number; label: string; color: string; glow?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-3 text-center"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}25`,
        boxShadow: glow ? `0 0 20px ${color}20` : undefined,
      }}
    >
      <div className="flex justify-center mb-1.5" style={{ color }}>{icon}</div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-[9px] uppercase tracking-wider mt-1" style={{ color: `${color}cc` }}>{label}</p>
    </div>
  );
}

function InfoRow({ label, value, capitalize, accent, highlight }: {
  label: string; value: string; capitalize?: boolean; accent?: boolean; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-bold ${capitalize ? "capitalize" : ""} ${accent ? "text-blue-400" : highlight ? "text-amber-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
