import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import baldwinImg from "@assets/IMG_20260525_143129_774_1779741902700.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
  const login = useLogin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Login berhasil" });
        setLocation("/");
      },
      onError: (err) => {
        toast({
          title: "Login gagal",
          description: (err.data as { error?: string })?.error || "Username atau password salah",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="mobile-app-container relative overflow-hidden items-center justify-center">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <img src={baldwinImg} alt="" className="w-full h-full object-cover opacity-25 blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/70 via-[#050d1f]/85 to-[#050d1f]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-screen px-6 py-12">
        {/* Logo / branding */}
        <div className="text-center mb-10 space-y-3">
          <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl shadow-blue-900/40 mb-4">
            <img src={baldwinImg} alt="Vincent Badak" className="w-full h-full object-cover object-top" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            VINCENT <span className="text-blue-400">BADAK</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Internal Tools Dashboard</p>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm">
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
                        className="bg-[#0a1428]/80 border-blue-900/40 text-white placeholder:text-slate-600 h-13 rounded-xl h-12 backdrop-blur-md"
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
                        className="bg-[#0a1428]/80 border-blue-900/40 text-white placeholder:text-slate-600 rounded-xl h-12 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-900/40 border-0 mt-2"
                disabled={login.isPending}
              >
                {login.isPending ? "Loading..." : "Access System"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-[10px] text-slate-600 mt-6">
            Powered by VINCENTNOTDEV · v1.4
          </p>
        </div>
      </div>
    </div>
  );
}
