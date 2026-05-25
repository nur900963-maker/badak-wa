import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const login = useLogin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(
      { data },
      {
        onSuccess: () => {
          toast({ title: "Login successful" });
          setLocation("/");
        },
        onError: (err) => {
          toast({ 
            title: "Login failed", 
            description: (err.data as { error?: string })?.error || "Invalid credentials",
            variant: "destructive"
          });
        },
      }
    );
  };

  return (
    <div className="mobile-app-container bg-black items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">VINCENT <span className="text-primary">BADAK</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Internal Tools Dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" className="bg-zinc-900/50 border-zinc-800 h-12" {...field} />
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
                    <Input type="password" placeholder="Password" className="bg-zinc-900/50 border-zinc-800 h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 font-bold tracking-wide uppercase" 
              disabled={login.isPending}
            >
              {login.isPending ? "Authenticating..." : "Access System"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}