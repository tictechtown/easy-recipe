import { useEffect, useState } from "react";

export default function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
