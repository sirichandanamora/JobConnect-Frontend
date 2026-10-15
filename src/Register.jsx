
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOB_SEEKER",
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
      await axios.post(
        "https://jobconnect-backend-u4x3.onrender.com/api/auth/register",
        formData,
        { timeout: 30000 }
      );

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          state: { registered: true },
        });
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const data = error.response.data;
        setMessage(
          typeof data === "string"
            ? data
            : data?.message || "Registration failed. Please try again."
        );
      } else if (error.code === "ECONNABORTED") {
        setMessage("The server is taking too long. Please try again.");
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
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <br /><br />

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
          autoComplete="new-password"
          required
        />

        <br /><br />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="RECRUITER">Recruiter</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}

export default Register;
