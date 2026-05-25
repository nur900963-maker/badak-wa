import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, MessageSquare, Wrench, Image as ImageIcon, Menu, LogOut, Users, Info, User as UserIcon, LayoutGrid, Shield, Database } from "lucide-react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-app-container dark">
      <Header />
      <div className="mobile-content pt-14">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { data: user } = useGetMe();
  const logout = useLogout();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/login"),
    });
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-14 bg-[#0a0f1e]/90 backdrop-blur-xl z-30 flex items-center px-4 justify-between border-b border-blue-900/30">
        <button onClick={() => setOpen(true)} className="text-white p-1">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-white tracking-tight">Dashboard</span>
        <div className="flex items-center gap-3">
          <button className="text-blue-400">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="text-blue-400">
            <UserIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[290px] p-0 border-r border-blue-900/30 bg-[#050a18] flex flex-col overflow-hidden">
          {/* Hero image */}
          <div className="relative h-40 overflow-hidden shrink-0">
            <img src={baldwinImg} alt="hero" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#050a18]" />
          </div>

          {/* User info */}
          <div className="px-5 pb-4 -mt-4 shrink-0">
            <h2 className="text-xl font-black text-white">VINCENT BADAK</h2>
            <p className="text-xs text-blue-400 font-medium mt-0.5">#{user?.username} · {user?.role}</p>
          </div>

          <div className="flex-1 py-2 flex flex-col gap-0.5 px-3 overflow-y-auto">
            <SidebarItem icon={<Info className="w-5 h-5" />} label="Tentang Apps" onClick={() => setOpen(false)} />
            <SidebarItem icon={<UserIcon className="w-5 h-5" />} label="My Account" href="/account" onClick={() => setOpen(false)} />
            <SidebarItem icon={<Database className="w-5 h-5" />} label="Database User" href="/admin/users" onClick={() => setOpen(false)} />
            {user?.role === "admin" && (
              <SidebarItem icon={<Shield className="w-5 h-5" />} label="Admin Page" href="/admin/users" onClick={() => setOpen(false)} />
            )}
            <div className="h-px bg-blue-900/30 my-2 mx-2" />
            <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Logout System" onClick={handleLogout} danger />
          </div>

          <div className="p-4 border-t border-blue-900/30 shrink-0">
            <p className="text-[10px] text-blue-500/80 font-mono mb-0.5">| Credits Developer</p>
            <p className="text-[11px] text-blue-300 mt-2">@pakvncnt <span className="text-blue-500">[ Developer ]</span></p>
            <p className="text-[11px] text-blue-300">@testipakvncnt <span className="text-blue-500">[ My Chanels ]</span></p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarItem({ icon, label, href, onClick, danger }: { icon: ReactNode; label: string; href?: string; onClick?: () => void; danger?: boolean }) {
  const cls = `w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${danger ? "text-red-400 hover:bg-red-500/10" : "text-blue-200 hover:text-white hover:bg-blue-500/10"}`;

  const inner = (
    <button onClick={onClick} className={cls}>
      <span className={danger ? "text-red-400" : "text-blue-400"}>{icon}</span>
      {label}
    </button>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/whatsapp", icon: MessageSquare, label: "WhatsApp" },
    { href: "/tools", icon: Wrench, label: "Tools" },
    { href: "/anime", icon: ImageIcon, label: "Anime" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[68px] bg-[#0a0f1e]/95 border-t border-blue-900/30 flex items-center justify-around px-2 z-30 pb-safe">
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all">
            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
            <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-cyan-400" : "text-slate-500"}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
