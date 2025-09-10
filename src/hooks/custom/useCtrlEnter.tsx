import { useEffect } from "react";

export default function useCtrlEnter({ callback }: { callback: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Periksa jika Ctrl dan Enter ditekan bersamaan
      if (event.ctrlKey && event.key === "Enter") {
        callback();
      }
    };

    // Tambahkan event listener untuk keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener saat komponen di-unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
