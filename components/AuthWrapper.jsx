import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthWrapper({ children }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading) return null;

  return children;
}