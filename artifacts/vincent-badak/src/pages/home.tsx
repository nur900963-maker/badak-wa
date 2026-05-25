import { useGetMe, useGetStats, useListNews } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Rss, UserCheck, Shield } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";
import { format } from "date-fns";

export default function Home() {
  const { data: user } = useGetMe();
  const { data: stats } = useGetStats();
  const { data: news } = useListNews();

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Card */}
      <Card className="bg-zinc-950 border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 shrink-0">
              <img src={baldwinImg} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">VINCENTNOTDEV</h2>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mt-1">Dashboard</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 grid gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><UserCheck className="w-4 h-4" /> Username</span>
              <span className="font-medium text-white">{user?.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> Role</span>
              <span className="font-medium text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" /> Expired</span>
              <span className="font-medium text-white">
                {user?.expiredAt ? format(new Date(user.expiredAt), "dd MMM yyyy") : "Lifetime"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-zinc-950 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Online</span>
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{stats?.onlineUsers ?? 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-950 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Members</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{stats?.totalMembers ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Resellers</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{stats?.totalResellers ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Requests</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{stats?.activeRequests ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* News Carousel */}
      <Card className="bg-zinc-950 border-white/5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2 text-primary font-bold">
            <Rss className="w-4 h-4" /> Info Update
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {news?.length ? (
            <div className="space-y-4">
              {news.slice(0,3).map(n => (
                <div key={n.id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <h4 className="font-bold text-white text-sm mb-1">{n.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{n.content}</p>
                  <span className="text-[10px] text-zinc-600 mt-2 block">{format(new Date(n.createdAt), "dd MMM yyyy HH:mm")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">No updates available at the moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}