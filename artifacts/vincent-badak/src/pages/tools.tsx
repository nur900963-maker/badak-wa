import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Unlock, Signal, Search, Activity, Phone, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ModalState = {
  open: boolean;
  type: string | null;
  step: "input" | "progress" | "result";
  progress: number;
  input: string;
  result: string | null;
};

export default function Tools() {
  const { toast } = useToast();
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: null,
    step: "input",
    progress: 0,
    input: "",
    result: null,
  });

  const tools = [
    { id: "wa", title: "Badak WA", icon: MessageSquare, desc: "WhatsApp Attack Tool", color: "text-primary", bg: "bg-primary/10", link: "/whatsapp" },
    { id: "unband", title: "Unband WA", icon: Unlock, desc: "Bypass restrictions", color: "text-green-500", bg: "bg-green-500/10" },
    { id: "provider", title: "Cek Provider", icon: Signal, desc: "Check HLR Provider", color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "umur", title: "Cek Umur Kartu", icon: Activity, desc: "Simcard Age Checker", color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "ngl", title: "Spam NGL", icon: MessageSquare, desc: "NGL.link Spammer", color: "text-red-500", bg: "bg-red-500/10" },
    { id: "nomor", title: "Cek Nomor", icon: Phone, desc: "Number Information", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const openTool = (id: string) => {
    setModal({ open: true, type: id, step: "input", progress: 0, input: "", result: null });
  };

  const executeTool = () => {
    if (!modal.input) {
      toast({ title: "Input Required", description: "Please fill in the required field.", variant: "destructive" });
      return;
    }

    setModal(prev => ({ ...prev, step: "progress", progress: 0 }));

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 20) + 10;
      if (p >= 100) {
        clearInterval(interval);
        
        // Generate fake results
        let result = "Success";
        if (modal.type === "provider") result = "Telkomsel - Jakarta (0812)";
        if (modal.type === "umur") result = "3 Years, 4 Months, 12 Days Active";
        if (modal.type === "nomor") result = "Status: Active\nRegistered: Yes\nRegion: Jabodetabek";
        if (modal.type === "unband") result = "Unban request submitted successfully to WA Support.";
        if (modal.type === "ngl") result = "500 messages sent to NGL link successfully.";

        setModal(prev => ({ ...prev, step: "result", progress: 100, result }));
      } else {
        setModal(prev => ({ ...prev, progress: p }));
      }
    }, 500);
  };

  const getToolDetails = (id: string | null) => tools.find(t => t.id === id);
  const activeTool = getToolDetails(modal.type);

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight">VINCENT <span className="text-primary">TOOLS</span></h1>
        <p className="text-sm text-muted-foreground">Select a tool to execute</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tools.map(tool => (
          tool.link ? (
            <Link key={tool.id} href={tool.link}>
              <Card className="bg-zinc-950 border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg}`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card key={tool.id} className="bg-zinc-950 border-white/5 hover:border-white/10 transition-colors cursor-pointer group" onClick={() => openTool(tool.id)}>
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg}`}>
                  <tool.icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{tool.desc}</p>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>

      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal(prev => ({ ...prev, open: false }))}>
        <DialogContent className="bg-zinc-950 border-white/10 w-[90%] max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeTool && <activeTool.icon className={`w-5 h-5 ${activeTool.color}`} />}
              {activeTool?.title}
            </DialogTitle>
            <DialogDescription>{activeTool?.desc}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {modal.step === "input" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                    {modal.type === "ngl" ? "NGL Username" : "Target Number"}
                  </label>
                  <Input 
                    placeholder={modal.type === "ngl" ? "username" : "628xxx"} 
                    className="bg-black border-zinc-800 font-mono"
                    value={modal.input}
                    onChange={(e) => setModal(prev => ({ ...prev, input: e.target.value }))}
                  />
                </div>
                <Button className="w-full font-bold uppercase tracking-widest" onClick={executeTool}>
                  Execute Tool <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}

            {modal.step === "progress" && (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Processing...</p>
                  <Progress value={modal.progress} className="h-2" />
                  <p className="text-xs font-mono text-muted-foreground">{modal.progress}%</p>
                </div>
              </div>
            )}

            {modal.step === "result" && (
              <div className="space-y-4">
                <div className="p-4 bg-black border border-zinc-800 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Result Output</p>
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{modal.result}</pre>
                </div>
                <Button variant="outline" className="w-full font-bold uppercase border-white/10" onClick={() => setModal(prev => ({ ...prev, open: false }))}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}