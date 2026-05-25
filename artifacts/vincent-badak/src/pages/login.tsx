import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ExternalLink } from "lucide-react";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
  const login = useLogin();
  const [, setLocation] = useLocation();
  const [failCount, setFailCount] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    if (blocked) return;
    login.mutate({ data }, {
      onSuccess: () => {
        setLocation("/");
      },
      onError: () => {
        const next = failCount + 1;
        setFailCount(next);
        if (next >= 3) {
          setBlocked(true);
        }
      },
    });
  };

  return (
    <div className="mobile-app-container relative overflow-hidden">
      {/* Full BG — Baldwin prominent, HD quality */}
      <div className="absolute inset-0 z-0">
        <img
          src={baldwinImg}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.45) saturate(1.1)" }}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#050d1f]/60 to-[#050d1f]/90" />
        {/* Blue tint glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-6 py-10">

        {/* App icon — Baldwin photo */}
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto w-22 h-22 w-[88px] h-[88px] rounded-[22px] overflow-hidden border-2 border-blue-400/50 shadow-2xl shadow-blue-900/60 mb-4">
            <img src={baldwinImg} alt="Vincent Badak" className="w-full h-full object-cover object-top" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg">
            VINCENT <span className="text-blue-400">BADAK</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Internal Tools Dashboard</p>
        </div>

        {/* Form or blocked state */}
        <div className="w-full max-w-sm space-y-4">
          {blocked ? (
            /* Blocked — too many wrong attempts */
            <div className="rounded-2xl bg-[#0a1428]/80 border border-red-900/40 p-5 text-center space-y-4 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="text-white font-bold text-base">Akun Tidak Ditemukan</p>
                <p className="text-slate-400 text-sm mt-1">
                  Terlalu banyak percobaan gagal. Beli akun VINCENT BADAK sekarang!
                </p>
              </div>
              <a
                href="https://t.me/pakvncnt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Beli Akun di @pakvncnt
              </a>
              <button
                onClick={() => { setFailCount(0); setBlocked(false); form.reset(); }}
                className="text-xs text-slate-500 underline"
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            className="bg-[#0a1428]/70 border-blue-900/50 text-white placeholder:text-slate-600 rounded-xl h-12 backdrop-blur-md focus:border-blue-500"
                            autoCapitalize="none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="bg-[#0a1428]/70 border-blue-900/50 text-white placeholder:text-slate-600 rounded-xl h-12 backdrop-blur-md focus:border-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Wrong attempts warning */}
                  {failCount > 0 && failCount < 3 && (
                    <div className="rounded-xl bg-red-900/20 border border-red-900/40 px-4 py-3 text-center">
                      <p className="text-red-400 text-xs font-medium">
                        Username / password salah ({failCount}/3). Belum punya akun?{" "}
                        <a href="https://t.me/pakvncnt" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">
                          Beli di @pakvncnt
                        </a>
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-900/40 border-0 mt-1"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Loading..." : "Access System"}
                  </Button>
                </form>
              </Form>

              {/* Buy account link */}
              <div className="text-center pt-1">
                <p className="text-slate-500 text-[11px]">
                  Belum punya akun?{" "}
                  <a href="https://t.me/pakvncnt" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold">
                    Beli di @pakvncnt
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="absolute bottom-6 text-center text-[10px] text-slate-600">
          Powered by VINCENTNOTDEV · v1.4
        </p>
      </div>
    </div>
  );
}
