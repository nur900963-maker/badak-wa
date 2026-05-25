import { useState } from "react";
import { useListUsers, useCreateUser, useDeleteUser, useExtendUser } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Clock, UserPlus, Users, Key } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const createUserSchema = z.object({
  username: z.string().min(3, "Min 3 characters"),
  role: z.enum(["reseller", "member"]),
  durationDays: z.string().nullable(),
});

export default function UsersPage() {
  const { data: users } = useListUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const extendUser = useExtendUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createdUserAuth, setCreatedUserAuth] = useState<{username: string, password: string} | null>(null);

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      role: "member",
      durationDays: "30",
    },
  });

  const onSubmit = (data: z.infer<typeof createUserSchema>) => {
    const duration = data.durationDays === "null" ? null : Number(data.durationDays);
    createUser.mutate(
      { data: { username: data.username, role: data.role, durationDays: duration } },
      {
        onSuccess: (res) => {
          toast({ title: "User Created successfully" });
          setCreatedUserAuth({ username: res.username, password: res.password });
          queryClient.invalidateQueries({ queryKey: ["/api/users"] });
          form.reset();
        },
        onError: (err) => {
          toast({ title: "Error", description: (err.data as { error?: string })?.error || "Failed to create user", variant: "destructive" });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "User Deleted" });
          queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        },
        onError: (err) => {
          toast({ title: "Error", description: (err.data as { error?: string })?.error, variant: "destructive" });
        }
      });
    }
  };

  const handleExtend = (id: number) => {
    const daysStr = prompt("Enter days to extend (e.g. 30):", "30");
    if (!daysStr) return;
    const days = parseInt(daysStr);
    if (isNaN(days)) {
      toast({ title: "Invalid input", variant: "destructive" });
      return;
    }

    extendUser.mutate({ id, data: { durationDays: days } }, {
      onSuccess: () => {
        toast({ title: "User Extended" });
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      },
      onError: (err) => {
        toast({ title: "Error", description: (err.data as { error?: string })?.error, variant: "destructive" });
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> USER DATABASE
          </h1>
          <p className="text-xs text-muted-foreground">Manage system users</p>
        </div>
        <Button size="sm" onClick={() => setCreateModalOpen(true)} className="font-bold uppercase text-xs">
          <UserPlus className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>

      <Card className="bg-zinc-950 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/50">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[120px]">User</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <p className="font-bold text-sm text-white">{u.username}</p>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      u.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                      u.role === 'reseller' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-primary/10 text-primary'
                    }`}>{u.role}</span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-zinc-400">
                    {u.expiredAt ? format(new Date(u.expiredAt), "dd MMM yy") : "LIFETIME"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => handleExtend(u.id)}>
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!users?.length && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground text-sm h-24">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 w-[90%] max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new reseller or member account.</DialogDescription>
          </DialogHeader>

          {!createdUserAuth ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" className="bg-black border-zinc-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="reseller">Reseller</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger className="bg-black border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="15">15 Days</SelectItem>
                          <SelectItem value="30">1 Month</SelectItem>
                          <SelectItem value="60">2 Months</SelectItem>
                          <SelectItem value="90">3 Months</SelectItem>
                          <SelectItem value="null">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full font-bold uppercase" disabled={createUser.isPending}>
                  {createUser.isPending ? "Creating..." : "Create User"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <Key className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white">Account Created!</h3>
                <p className="text-xs text-muted-foreground">Please copy the password below, it will only be shown once.</p>
              </div>
              
              <div className="bg-black p-4 rounded-lg border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Username</span>
                  <span className="font-bold text-white">{createdUserAuth.username}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Password</span>
                  <span className="font-mono font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded">{createdUserAuth.password}</span>
                </div>
              </div>

              <Button className="w-full font-bold uppercase" onClick={() => {
                setCreatedUserAuth(null);
                setCreateModalOpen(false);
              }}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}