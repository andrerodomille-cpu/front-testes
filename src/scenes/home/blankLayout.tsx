import React from "react";
import { Outlet } from "react-router-dom";

const BlankLayout: React.FC = () => {
  return (
    <div className="p-4 h-screen overflow-auto">
      <Outlet />
    </div>
  );
};

export default BlankLayout;
