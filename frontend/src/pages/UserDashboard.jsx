import { useOutletContext } from "react-router-dom";
import JobList from "../components/JobList";

const UserDashboard = () => {
  // ✅ GET FILTERS FROM UserLayout
  const { filters } = useOutletContext();

  return (
    <div style={{ minHeight: "100vh", background: "#020617" }}>
      <div style={{ padding: "30px" }}>
        <JobList filters={filters} />
      </div>
    </div>
  );
};

export default UserDashboard;
