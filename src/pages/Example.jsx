import React from "react";
import { FiSearch, FiPhone } from "react-icons/fi";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FiSave, FiX } from "react-icons/fi";
const Example = () => {
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const countries = [
    { value: "ru", label: "Россия" },
    { value: "us", label: "США" },
    { value: "fr", label: "Франция" },
  ];
  const handleSave = () => {
    console.log("Сохранение...");
  };
  return (
    <form>
      <Input
        label="Телефон"
        name="phone"
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+7 (999) 999-99-99"
        icon={FiPhone}
      />
      <Input
        label="Страна"
        name="country"
        type="select"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={countries}
        placeholder="Выберите страну"
      />
      <Input
        label="Поиск"
        name="search"
        type="search"
        options={countries}
        onChange={(e) => console.log("Выбрано", e.target.value)}
        placeholder="Поиск..."
        icon={FiSearch}
      />
      <Button type="submit">Отправить</Button>
      <div className="mt-60">
        <Button onClick={handleSave} startIcon={FiSave} size="md">
          Сохранить
        </Button>
        <Button variant="outline" endIcon={FiX} size="sm">
          Отмена
        </Button>
        <Button loading size="lg">
          Загрузка...
        </Button>
        <Button disabled size="md">
          Неактивно
        </Button>
      </div>
    </form>
  );
};

export default Example;
