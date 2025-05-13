import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    // Lưu title cũ để khôi phục khi unmount
    const prevTitle = document.title;

    // Đặt title mới
    document.title = title;

    // Khôi phục title khi unmount
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
