
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(
    location.state?.registered
      ? "Registration successful! Please log in."
      : ""
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://jobconnect-backend-u4x3.onrender.com/api/auth/login",
        formData,
        { timeout: 60000 }
      );

      const data = response.data;

      // Support either a direct response or { user: {...}, token: "..." }
      const user = data.user || data;
      const token = data.token || user.token;
      const role = user.role;
      const userId = user.userId ?? user.id;
      const name = user.name;

      if (!token || !role) {
        console.error("Unexpected login response:", data);
        setMessage(
          "Login response is missing the token or user role. Please check the backend response."
        );
        return;
      }

      if (!["JOB_SEEKER", "RECRUITER", "ADMIN"].includes(role)) {
        setMessage("Unknown user role. Please contact support.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (userId != null) {
        localStorage.setItem("userId", String(userId));
      }

      if (name) {
        localStorage.setItem("name", name);
      }

      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/job-seeker/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const data = error.response.data;
        setMessage(
          typeof data === "string"
            ? data
            : data?.message || "Invalid email or password."
        );
      } else if (error.code === "ECONNABORTED") {
        setMessage(
          "The server is taking too long to respond. Please try again."
        );
      } else {
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>JobConnect</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}

export default Login;
