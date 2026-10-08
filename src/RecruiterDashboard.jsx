function RecruiterDashboard() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>Recruiter Dashboard</h2>

      <p>Welcome to your recruiter dashboard! 🎉</p>

      <p>
        Manage your job postings and applicants from here.
      </p>

      {token && <p>Authentication: ✅ Active</p>}

      <div>
        <button>Post a Job</button>
        <button>My Jobs</button>
        <button>Applicants</button>
      </div>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default RecruiterDashboard;