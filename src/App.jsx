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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Navigate to="/register" />}
        />

        {/* Authentication */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/jobs/:id/apply"
          element={<ApplyJob />}
        />

        {/* Job Seeker Dashboard */}
        <Route
  path="/job-seeker/dashboard"
  element={
    <ProtectedRoute>
      <JobSeekerHome />
    </ProtectedRoute>
  }
/>

        {/* Recruiter Dashboard */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
           <MyApplications />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-seeker/dashboard"
  element={
    <ProtectedRoute>
      <JobSeekerHome />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;