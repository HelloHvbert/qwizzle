import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Template() {
  return (
    <div className="flex min-h-screen w-[100%] flex-col items-center">
      <Header />

      <div className="bg-secondary flex w-full flex-grow justify-center py-9">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
