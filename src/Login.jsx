
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
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
        formData
      );

      const { token, role, userId, name } = response.data;

      if (!token || !role) {
        setMessage("Login response is missing required information.");
        return;
      }

      // Store login information
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (userId !== undefined && userId !== null) {
        localStorage.setItem("userId", String(userId));
      }

      if (name) {
        localStorage.setItem("name", name);
      }

      console.log("Login successful");

      // Navigate according to the user's role
      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "JOB_SEEKER") {
        navigate("/job-seeker/dashboard");
      } else {
        setMessage("Unknown user role. Please contact support.");
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
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </div>
  );
}

export default Login;
