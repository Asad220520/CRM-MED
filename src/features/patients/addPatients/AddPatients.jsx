import { useForm } from "react-hook-form";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

export default function AddPatientForm() {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow border space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Записи клиентов</h2>
        <h2 className="text-xl font-semibold">Добавить пациента</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ФИО */}
        <Input
          label="ФИО"
          placeholder="Мария Ивановна"
          {...register("fullName")}
        />

        {/* Дата рождения */}
        <Input  label="Дата рождения" type="date" {...register("birthDate")} />

        {/* Пол */}
        <Select
          label="Пол"
          options={[
            { value: "male", label: "Мужской" },
            { value: "female", label: "Женский" },
          ]}
          {...register("gender")}
        />

        {/* Телефон */}
        <Input
          label="Телефон номер"
          placeholder="+996 550 941 433"
          {...register("phone")}
        />

        {/* Отделение */}
        <Select
          label="Отделение"
          options={[
            { value: "cardiology", label: "Кардиология" },
            // другие отделения...
          ]}
          {...register("department")}
        />

        {/* Врач */}
        <Select
          label="Врач"
          options={[
            { value: "elena", label: "Елена - 404 кабинет" },
            // другие врачи...
          ]}
          {...register("doctor")}
        />

        {/* Услуга врача */}
        <Select
          label="Услуги врача"
          options={[
            { value: "consult", label: "Консультация кардиолога - 3400 с" },
            { value: "stress", label: "Стресс-ЭхоКГ - 5500 с" },
            { value: "coro", label: "Коронарография - 3700 с" },
          ]}
          {...register("service")}
        />

        {/* Регистратор */}
        <Select
          label="Регистратор"
          options={[
            { value: "artem", label: "Артем Исанов" },
            // другие...
          ]}
          {...register("registrar")}
        />

        {/* Статус пациента */}
        <Select
          label="Статус пациента"
          options={[
            { value: "queue", label: "Живая очередь" },
            { value: "pre", label: "Предзапись" },
            { value: "cancelled", label: "Отмененные" },
          ]}
          colorizeOptions // если нужно покрасить как на скрине
          {...register("status")}
        />

        {/* Время */}
        <Input
          label="Укажите время"
          placeholder="18:00 - 20:00"
          {...register("time")}
        />
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline">Назад</Button>
        <Button type="submit">Далее</Button>
      </div>
    </form>
  );
}
