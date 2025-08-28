import React from "react";
import DoctorList from "./DoctorList";

const DoctorsPage = () => {
  return (
    <div className="bg-white  h-[85vh] py-6 px-20 rounded-xl shadow  space-y-6  shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <DoctorList />
    </div>
  );
};

export default DoctorsPage;
