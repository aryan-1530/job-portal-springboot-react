import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
  });

  return (
    <>
      <Navbar filters={filters} setFilters={setFilters} />
      <Outlet context={{ filters }} />
    </>
  );
}
