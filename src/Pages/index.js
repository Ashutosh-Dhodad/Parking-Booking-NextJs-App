import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirect to login page on load
  }, []);

  return null; // Nothing here since we're redirecting
}
