// =========================
// src/components/WeeklyCalendar/hooks/useAppointments.js
// =========================
import { useEffect, useMemo, useState } from "react";
import { asText } from "../helpers/text";
import { apiListAppointments } from "../api";

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // загрузка списка (GET /en/calendar/)
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const data = await apiListAppointments(ac.signal);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError")
          setError(e.message || "Не удалось загрузить");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // опции для фильтров
  const doctorOptions = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      const uname = asText(a?.doctor?.username);
      const jtitle = asText(a?.doctor?.job_title);
      if (uname) map.set(uname, `${uname}${jtitle ? ` (${jtitle})` : ""}`);
    });
    const arr = Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
    arr.sort((a, b) => a.label.localeCompare(b.label, "ru"));
    return arr;
  }, [appointments]);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    appointments.forEach((a) => {
      const dep = asText(a?.department?.department_name);
      if (dep) set.add(dep);
    });
    const arr = Array.from(set.values()).map((v) => ({ value: v, label: v }));
    arr.sort((a, b) => a.label.localeCompare(b.label, "ru"));
    return arr;
  }, [appointments]);

  return {
    appointments,
    setAppointments,
    loading,
    error,
    setError,
    doctorOptions,
    departmentOptions,
    // Re-export convenient API helpers

  };
}
