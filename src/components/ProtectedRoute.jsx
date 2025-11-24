// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/"); // redirect if no token
//         return;
//       }

//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/verify`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           // invalid or expired token
//           localStorage.removeItem("token");
//           document.cookie = "token=; path=/; max-age=0"; // clear cookie too
//           router.push("/");
//         }
//       } catch (err) {
//         console.error("Auth verification failed:", err);
//         router.push("/");
//       }
//     };

//     checkAuth();
//   }, [router]);

//   return <>{children}</>;
// }
