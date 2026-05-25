import { useState, useEffect } from "react";
import { useGetMe, useCreateWaRequest, useListWaRequests, useGetWaRequest } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Shield, Activity, Clock, Terminal } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const requestSchema = z.object({
  targetNumber: z.string().regex(/^628[0-9]{8,12}$/, "Format must be 628xxx (10-15 digits)"),
  method: z.enum(["aroxen", "travaz", "lochturn", "overhold"]),
});

export default function WhatsApp() {
  const { data: user } = useGetMe();
  const { data: requests } = useListWaRequests();
  const createReq = useCreateWaRequest();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activeRequest = requests?.find(r => ["queued", "connecting", "sending", "processing"].includes(r.status));
  const { data: pollingData } = useGetWaRequest(activeRequest?.id ?? 0, {
    query: {
      enabled: !!activeRequest?.id,
      refetchInterval: 5000,
      queryKey: ['waRequest', activeRequest?.id]
    }
  });

  const currentReq = pollingData || activeRequest;

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      targetNumber: "",
      method: "aroxen",
    },
  });

  const onSubmit = (data: z.infer<typeof requestSchema>) => {
    createReq.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Request Started", description: "Attack queued successfully." });
        queryClient.invalidateQueries({ queryKey: ["/api/wa/requests"] });
        form.reset();
      },
      onError: (err) => {
        toast({ title: "Failed", description: (err.data as { error?: string })?.error || "Error", variant: "destructive" });
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card className="bg-zinc-950 border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-primary/20 shrink-0">
            <img src={baldwinImg} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{user?.username}</h3>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span className="uppercase text-primary font-bold">{user?.role}</span>
              <span>•</span>
              <span>{user?.expiredAt ? format(new Date(user.expiredAt), "dd MMM yy") : "Lifetime"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tool */}
      <Card className="bg-zinc-950 border-white/5">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> BADAK WHATSAPP
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Powerful WhatsApp Tool</p>
            </div>
            <div className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
              Active
            </div>
          </div>

          {!currentReq ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Target Number</FormLabel>
                      <FormControl>
                        <Input placeholder="6281234567890" className="bg-black border-zinc-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Attack Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black border-zinc-800">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aroxen">Aroxen (Fast)</SelectItem>
                          <SelectItem value="travaz">Travaz (Heavy)</SelectItem>
                          <SelectItem value="lochturn">Lochturn (Stealth)</SelectItem>
                          <SelectItem value="overhold">Overhold (Max)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full font-bold uppercase tracking-wide" disabled={createReq.isPending}>
                  <Terminal className="w-4 h-4 mr-2" /> Execute Attack
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="bg-black p-4 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</span>
                  <span className="text-xs font-bold text-primary capitalize bg-primary/10 px-2 py-1 rounded">
                    {currentReq.status}
                  </span>
                </div>
                
                <Progress value={currentReq.progressPct} className="h-2 mb-2" />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{currentReq.progressPct}% Complete</span>
                  <span>{currentReq.currentStep || 'Initializing...'}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 grid gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-mono text-white">{currentReq.targetNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-mono text-primary uppercase">{currentReq.method}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="font-mono text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      {currentReq.estimatedDoneAt ? format(new Date(currentReq.estimatedDoneAt), "HH:mm:ss") : "--:--:--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}