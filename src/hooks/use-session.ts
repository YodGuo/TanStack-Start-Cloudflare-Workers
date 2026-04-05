import { useSession as useBetterAuthSession } from "@/lib/auth/client";

export function useSession() {
  const { data: session, isPending } = useBetterAuthSession();
  return {
    user: session?.user ?? null,
    isAdmin: session?.user?.role === "admin",
    isLoading: isPending,
  };
}
