// =========================
// src/features/calendar/components/ContextMenu.jsx
// =========================
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { Edit2 } from "lucide-react";
import { getPatientId } from "../../../shared/getPatientId";

function Item({ onClick, children, danger = false }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={
        "flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-50 " +
        (danger ? "text-red-600" : "text-gray-800")
      }
    >
      {children}
    </button>
  );
}

export default function ContextMenu({ rec, appointment, setIsOpen, onDelete }) {
  const navigate = useNavigate();
  const data = rec || appointment || {};

  // ВАЖНО: теперь берём именно patientId (как в списке пациентов)
  const patientId = getPatientId(data);

  const goToEdit = useCallback(() => {
    if (!patientId) {
      console.warn("ContextMenu: patientId not found in record:", data);
      return;
    }
    navigate(`/editPasient/${encodeURIComponent(String(patientId))}`);
    setIsOpen?.(false);
  }, [navigate, patientId, data, setIsOpen]);

  const handleDelete = useCallback(() => {
    if (typeof onDelete === "function" && patientId) {
      onDelete(patientId); // <-- передаём patientId, как в PatientList
      setIsOpen?.(false);
    } else {
      console.warn("ContextMenu: delete pressed but patientId is missing", {
        data,
      });
    }
  }, [onDelete, patientId, setIsOpen]);

  return (
    <div
      role="menu"
      className="min-w-[200px] rounded-xl border bg-white p-2 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <Item onClick={goToEdit}>
        <Edit2 size={18} /> Редактировать
      </Item>
      <Item onClick={handleDelete} danger>
        <MdDeleteOutline size={18} className="text-red-500" /> Удалить
      </Item>
    </div>
  );
}
