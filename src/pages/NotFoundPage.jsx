import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <img
        className="animate-pulse  w-84"
        src="https://cdn-icons-png.freepik.com/512/7214/7214326.png"
        alt="404 Not Found"
      />
      <h1 className="text-4xl animate-pulse font-bold text-blue-500">404 - Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
