import React from "react";
import Button from "../../../components/ui/Button";
import AddPatientForm from "../addPatients/AddPatients";
import { useNavigate } from "react-router-dom";

const PatientsPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate("/addPatients");
    };
  return (
    <div>
      PatientsPage
      <Button onClick={handleClick} startIcon="FiPlus">
        Добавить пациента
      </Button>
    </div>
  );
};

export default PatientsPage;
