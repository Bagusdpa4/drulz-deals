import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export const useSiteStatus = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let channel;

    const fetchStatus = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("is_open, closed_message")
        .eq("id", 1)
        .single();
      if (data) {
        setIsOpen(data.is_open);
        setClosedMessage(data.closed_message ?? "");
      }
      setLoaded(true);
    };

    fetchStatus();

    // realtime: begitu admin toggle di Supabase, semua customer ke-update otomatis
    channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "site_settings" },
        (payload) => {
          setIsOpen(payload.new.is_open);
          setClosedMessage(payload.new.closed_message ?? "");
        },
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { isOpen, closedMessage, loaded };
};
