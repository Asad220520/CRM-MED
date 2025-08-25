import React, { useState } from "react";
import DetailedReport from "./ReportExact";
import CabinetReport from "./ReportDoctor";
import SummaryReport from "./SummaryReport";
import Sidebar from "../components/Sidebar";
import ReportExact from "./ReportExact";

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState("detailed");

  const handleBack = () => {
    console.log("Назад");
    window.history.back();
  };

  const renderActiveReport = () => {
    switch (activeReport) {
      case "detailed":
        return <ReportExact />;
      case "closed":
        return <CabinetReport />;
      case "summary":
        return <SummaryReport />;
      default:
        return <DetailedReport />;
    }
  };

  return (
    <div className="bg-white  h-[85vh] flex gap-6">
      {/* Sidebar */}
      <Sidebar
        activeReport={activeReport}
        setActiveReport={setActiveReport}
        onBack={handleBack}
      />

      {/* Main Content */}
      <div className="bg-white h-full flex-1 rounded-lg shadow-[0px_0px_2px_1px_rgba(128,128,128,0.5)] p-4">
        {/* Report Content */}
        {renderActiveReport()}
      </div>
    </div>
  );
};

export default ReportsPage;
