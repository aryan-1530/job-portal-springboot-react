import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import UserLogin from "./pages/UserLogin";
import EmployerLogin from "./pages/EmployerLogin";
import AdminLogin from "./pages/AdminLogin";

import UserDashboard from "./pages/UserDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AdminUsers from "./components/AdminUsers";
import AdminJobs from "./components/AdminJobs";
import UserProfile from "./pages/UserProfile";
import Register from "./pages/Register"; // ✅ ADD THIS

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import EmployerLayout from "./layouts/EmployerLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* LOGIN */}
        <Route path="/user" element={<UserLogin />} />
        <Route path="/employer" element={<EmployerLogin />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* USER */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* EMPLOYER */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashboard />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="jobs" element={<AdminJobs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
