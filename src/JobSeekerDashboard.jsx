import { useNavigate } from "react-router-dom";
function JobSeekerDashboard() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>Job Seeker Dashboard</h2>

      <p>Welcome to your JobConnect dashboard! 🎉</p>

      <p>
        You are logged in successfully.
      </p>

      {token && <p>Authentication: ✅ Active</p>}

      <button onClick={handleLogout}>
        Logout
      </button>
      <button onClick={() => navigate("/my-applications")}>
      My Applications
      </button>
    </div>
  );
}

export default JobSeekerDashboard;