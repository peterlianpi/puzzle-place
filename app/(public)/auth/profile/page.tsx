// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useGetUser } from "@/features/auth/api/use-get-user";

// export default function ProfileRedirectPage() {
//   const router = useRouter();
//   const { data: userData, isLoading, error } = useGetUser();

//   // useEffect(() => {
//   //   if (isLoading) return;

//   //   if (error || !userData?.user) {
//   //     router.push("/auth/login");
//   //     return;
//   //   }

//   //   const user = userData.user;
//   //   const redirectUrl = new URLSearchParams(window.location.search).get("redirect");

//   //   if (redirectUrl) {
//   //     router.replace(redirectUrl);
//   //   } else if (user.username) {
//   //     router.replace(`/@${user.username}`);
//   //   } else {
//   //     // Username not set, stay on profile (could allow setting here)
//   //     router.replace("/auth/profile");
//   //   }
//   // }, [userData, isLoading, error, router]);

//   return (
//     <motion.div
//       className="min-h-screen flex items-center justify-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="text-center">
//         <motion.div
//           className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.4, delay: 0.2 }}
//         ></motion.div>
//         <motion.p
//           className="text-muted-foreground"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           Redirecting to your profile...
//         </motion.p>
//       </div>
//     </motion.div>
//   );
// }
