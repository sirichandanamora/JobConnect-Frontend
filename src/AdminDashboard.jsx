function AdminDashboard() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>Admin Dashboard</h2>

      <p>Welcome to the admin dashboard! 🎉</p>

      <p>
        Manage users, jobs, and applications from here.
      </p>

      {token && <p>Authentication: ✅ Active</p>}

      <div>
        <button>Manage Users</button>
        <button>Manage Jobs</button>
        <button>Manage Applications</button>
      </div>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;