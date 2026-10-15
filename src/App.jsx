
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";

import JobSeekerHome from "./JobSeekerHome";
import RecruiterDashboard from "./RecruiterDashboard";
import AdminDashboard from "./AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

import Jobs from "./Jobs";
import JobDetails from "./JobDetails";
import ApplyJob from "./ApplyJob";
import MyApplications from "./MyApplications";


import Home from "./Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public Job Pages */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Apply for a Job */}
        <Route
          path="/jobs/:id/apply"
          element={<ApplyJob />}
        />

        {/* Job Seeker Dashboard */}
        <Route
          path="/job-seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
              <JobSeekerHome />
            </ProtectedRoute>
          }
        />

        {/* Optional shortcut for Job Seeker Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
              <JobSeekerHome />
            </ProtectedRoute>
          }
        />

        {/* My Applications */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Dashboard */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RECRUITER"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown URLs */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
