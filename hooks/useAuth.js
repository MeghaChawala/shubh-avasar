import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";

export default function useAuth(redirectTo = "/login") {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace(redirectTo);
      }
    });
    return () => unsubscribe();
  }, [router, redirectTo]);
}
