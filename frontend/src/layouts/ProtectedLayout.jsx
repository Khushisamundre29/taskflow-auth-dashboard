import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;