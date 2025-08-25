import React from "react";
import Button from "../../../../components/ui/Button";
import { getCurrentUserRole } from "../../../../lib/auth";
import { ROLES } from "../../../../lib/roles";

export default function PatientForm({
  formData,
  registrars,
  doctors,
  statusOptions,
  departments,
  services,
  paymentOptions,
  handleChange,
  handleSave,
  navigate,
  saving,
}) {
  const userRole = getCurrentUserRole();
  return (
    <>
      <div className="overflow-auto max-h-[360px] scrollbar-thin scrollbar-blue flex gap-4">
        {userRole !== ROLES.DOCTOR && <div className="flex flex-col gap-4 w-full">
          <div>
            <label className="block text-sm mb-1 font-medium">Имя</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Регистратор
            </label>
            <select
              value={formData.registrar || ""}
              onChange={(e) =>
                handleChange("registrar", Number(e.target.value))
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите регистратора</option>
              {registrars.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Врач</label>
            <select
              value={formData.doctor || ""}
              onChange={(e) => handleChange("doctor", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите врача</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Укажите время
            </label>
            <input
              type="datetime-local"
              value={
                formData.appointment_date
                  ? formData.appointment_date.slice(0, 16)
                  : ""
              }
              onChange={(e) => handleChange("appointment_date", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Укажите статус пациента
            </label>
            <select
              value={formData.patient_status || ""}
              onChange={(e) => handleChange("patient_status", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите статус</option>
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>}

        <div className="flex flex-col gap-4 w-full">
         {userRole !== ROLES.DOCTOR && <>  <div>
            <label className="block text-sm mb-1 font-medium">Отделение</label>
            <select
              value={formData.department || ""}
              onChange={(e) =>
                handleChange("department", Number(e.target.value))
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите отделение</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Услуга врача
            </label>
            <select
              value={formData.service_type || ""}
              onChange={(e) =>
                handleChange("service_type", Number(e.target.value))
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите услугу</option>
              {services.flatMap((srv) =>
                srv.department_services.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.type} {el.price} сом
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Телефон</label>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Тип оплаты</label>
            <select
              value={formData.payment_type || ""}
              onChange={(e) => handleChange("payment_type", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите тип оплаты</option>
              {paymentOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div> </>}

          <div>
            <label className="block text-sm mb-1 font-medium">
              Комментарий
            </label>
            <textarea
              value={formData.info || ""}
              onChange={(e) => handleChange("info", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          Назад
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-full text-white ${
            saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>
    </>
  );
}
