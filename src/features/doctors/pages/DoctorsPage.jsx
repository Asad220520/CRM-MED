import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";

const DoctorsPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/doctorcreate");
  };

  return (
    <div>
      DoctorsPage{" "}
      <Button onClick={handleClick} startIcon="FiPlus">
        Добавить нового врача
      </Button>
    </div>
  );
};

export default DoctorsPage;
