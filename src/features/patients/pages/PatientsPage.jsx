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
    <div className="bg-white h-[85vh] p-6 rounded-xl shadow border space-y-6">
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
