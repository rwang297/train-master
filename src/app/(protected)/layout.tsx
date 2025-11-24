"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);

        // Check expiration (if the token has an `exp` claim)
        if (decoded.exp && decoded.exp * 5000 < Date.now()) {
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; max-age=0";
          router.push("/");
          return;
        }
      } catch {
        // Invalid token — logout user
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 bg-white">
        Checking authentication...
      </div>
    );

  return <>{children}</>;
}
