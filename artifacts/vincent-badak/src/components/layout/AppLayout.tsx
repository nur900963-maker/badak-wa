import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, MessageSquare, Wrench, Image as ImageIcon, Menu, X, LogOut, Users, Info, User as UserIcon } from "lucide-react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-app-container dark">
      <Header />
      <div className="mobile-content pt-16">
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
      onSuccess: () => {
        setLocation("/login");
      }
    });
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl z-30 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="text-white hover:bg-white/10 rounded-full h-10 w-10">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="font-black text-lg tracking-tight">VINCENT<span className="text-primary">NOTDEV</span></div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] bg-zinc-950 border-r border-white/10 p-0 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-black/40">
            <h2 className="text-xl font-black text-white">VINCENTNOTDEV</h2>
            <p className="text-sm text-primary font-medium mt-1">#{user?.username} - {user?.role}</p>
          </div>
          
          <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
            <SidebarItem icon={<Info className="w-5 h-5" />} label="Tentang Apps" onClick={() => setOpen(false)} />
            <SidebarItem icon={<UserIcon className="w-5 h-5" />} label="My Account" onClick={() => setOpen(false)} />
            
            {(user?.role === "admin" || user?.role === "reseller") && (
              <>
                <div className="h-px bg-white/5 my-2 mx-2" />
                <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Management</div>
                <SidebarItem icon={<Users className="w-5 h-5" />} label="Database User" href="/admin/users" onClick={() => setOpen(false)} />
              </>
            )}
            
            <div className="h-px bg-white/5 my-2 mx-2" />
            <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Logout System" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10" />
          </div>

          <div className="p-4 border-t border-white/5 text-xs text-muted-foreground text-center bg-black/40 space-y-1">
            <p>@pakvncnt [ Developer ]</p>
            <p>@testipakvncnt [ My Channel ]</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarItem({ icon, label, href, onClick, className = "" }: { icon: ReactNode, label: string, href?: string, onClick?: () => void, className?: string }) {
  const content = (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors ${className}`}>
      {icon}
      {label}
    </button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
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
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-950 border-t border-white/5 pb-safe flex items-center justify-around px-2 z-30">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl gap-1 transition-all ${isActive ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}