import React from "react";
import Button from "../../../components/ui/Button";
import AddPatientForm from "../addPatients/AddPatients";
import { useNavigate } from "react-router-dom";
import PatientList from "../components/PatientList";

const PatientsPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/addPatients");
  };
  return (
    <div className="bg-white  h-[85vh] py-6 px-30 rounded-xl shadow  space-y-6  shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <div className="flex  justify-between">
        <h1 className="text-[22px] font-[500]">Все записи клиентов</h1>
        <Button onClick={handleClick} startIcon="FiPlus">
          Добавить пациента
        </Button>
      </div>
      <PatientList />
    </div>
  );
};

export default PatientsPage;
