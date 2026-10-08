import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );

      // Get login information from backend
      const { token, role, userId, name } = response.data;

      // Store login information
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", name);

      setMessage("Login successful! 🎉");

      console.log("Login successful");
      console.log("Role:", role);
      console.log("User ID:", userId);

      // Role-based navigation
      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } 
      else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } 
      else {
        navigate("/job-seeker/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Invalid email or password"
        );
      } else {
        setMessage("Unable to connect to the server.");
      }
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

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

export default Login;