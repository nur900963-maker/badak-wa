import { useGetMe } from "@workspace/api-client-react";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
      queryKey: ["auth-me"],
    },
  });
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user) {
        if (location !== "/login") {
          setLocation("/login");
        }
      } else {
        if (location === "/login") {
          setLocation("/");
        }
      }
    }
  }, [isLoading, isError, user, location, setLocation]);

  if (isLoading) {
    return (
      <div className="mobile-app-container items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
