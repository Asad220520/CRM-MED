// =========================
// src/pages/NotificationPage.jsx
// =========================
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAllRead, markRead, clear } from "@/redux/notificationsSlice";

function NotificationPage() {
  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.notifications || {});

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Уведомления</h1>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(markAllRead())}
            className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
          >
            Отметить все как прочитанные
          </button>
          <button
            onClick={() => dispatch(clear())}
            className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300"
          >
            Очистить
          </button>
        </div>
      </div>

      {!items.length && (
        <div className="text-center text-gray-500 text-sm">
          Уведомлений пока нет
        </div>
      )}

      <ul className="space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className={`p-4 rounded-xl border shadow-sm ${
              n.read ? "bg-white" : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && (
                  <button
                    onClick={() => dispatch(markRead(n.id))}
                    className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Прочитать
                  </button>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPage;
