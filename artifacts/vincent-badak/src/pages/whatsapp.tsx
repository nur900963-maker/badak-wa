import { useState } from "react";
import { useGetMe, useCreateWaRequest, useListWaRequests, useGetWaRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Clock } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const requestSchema = z.object({
  targetNumber: z.string().regex(/^628[0-9]{8,12}$/, "Format: 628xxxxxxxxxx (10-15 digit)"),
  method: z.enum(["aroxen", "travaz", "lochturn", "overhold"]),
});

export default function WhatsApp() {
  const { data: user } = useGetMe();
  const { data: requests } = useListWaRequests();
  const createReq = useCreateWaRequest();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activeRequest = requests?.find((r) =>
    ["queued", "connecting", "sending", "processing"].includes(r.status)
  );
  const { data: pollingData } = useGetWaRequest(activeRequest?.id ?? 0, {
    query: {
      enabled: !!activeRequest?.id,
      refetchInterval: 5000,
      queryKey: ["waRequest", activeRequest?.id],
    },
  });

  const currentReq = pollingData || activeRequest;

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { targetNumber: "", method: "aroxen" },
  });

  const onSubmit = (data: z.infer<typeof requestSchema>) => {
    createReq.mutate(
      { data },
      {
        onSuccess: () => {
          toast({ title: "Request Started", description: "Request queued successfully." });
          queryClient.invalidateQueries({ queryKey: ["/api/wa/requests"] });
          form.reset();
        },
        onError: (err) => {
          toast({
            title: "Failed",
            description: (err.data as { error?: string })?.error || "Error",
            variant: "destructive",
          });
        },
      }
    );
  };

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
        <img src={baldwinImg} alt="" className="w-full h-full object-cover object-center opacity-15 blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/80 via-[#050d1f]/90 to-[#050d1f]" />
      </div>

      <div className="relative z-10">
        {/* Profile Banner */}
        <div className="relative h-36 overflow-hidden">
          <img src={baldwinImg} alt="" className="w-full h-full object-cover object-top opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[#050d1f]" />

          <div className="absolute bottom-0 left-0 right-0 pb-2 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg shadow-blue-900/50 mb-1 -mb-1">
              <img src={baldwinImg} alt="" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>

        {/* Username + badges */}
        <div className="flex flex-col items-center pb-4 pt-3 bg-[#050d1f]/80">
          <p className="text-base font-bold text-white">{user?.username}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#0d1a35] border border-blue-800/40 text-white capitalize">
              ROLE : {user?.role}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
              EXPIRED : {expired}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* WA Card header */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0a1428]/80 border border-blue-900/30">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.124 1.532 5.852L0 24l6.305-1.493A11.963 11.963 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.5-5.197-1.375l-.373-.214-3.743.886.932-3.623-.235-.38A9.964 9.964 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">BADAK WHATSAPP</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Status: Active | Method: 4 Available</p>
            </div>
          </div>

          {/* Form or Progress */}
          {!currentReq ? (
            <div className="rounded-2xl bg-[#0a1428]/80 border border-blue-900/30 p-5 space-y-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="targetNumber"
                    render={({ field }) => (
                      <FormItem>
                        <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-1">Target Number</p>
                        <FormControl>
                          <Input
                            placeholder="628xxxxxxxxxx"
                            className="bg-[#050d1f] border-blue-900/40 text-white placeholder:text-slate-600 rounded-xl h-12 font-mono"
                            {...field}
                          />
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
                        <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-1">Select Method</p>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#050d1f] border-blue-900/40 text-white rounded-xl h-12">
                              <SelectValue placeholder="Select - Badak" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0a1428] border-blue-900/40">
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

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-900/40 border-0"
                    disabled={createReq.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Let&apos;s Go
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0a1428]/80 border border-blue-900/30 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Status</span>
                <span className="text-xs font-bold text-blue-400 capitalize bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {currentReq.status}
                </span>
              </div>
              <Progress value={currentReq.progressPct} className="h-2 rounded-full" />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{currentReq.progressPct}% Complete</span>
                <span>{currentReq.currentStep || "Initializing..."}</span>
              </div>
              <div className="pt-3 border-t border-blue-900/20 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Target</span>
                  <span className="font-mono text-white">{currentReq.targetNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Method</span>
                  <span className="font-mono text-blue-400 uppercase">{currentReq.method}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">ETA</span>
                  <span className="font-mono text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {currentReq.estimatedDoneAt ? format(new Date(currentReq.estimatedDoneAt), "HH:mm:ss") : "--:--:--"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
