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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      formData
    );

    const token = response.data;

    localStorage.setItem("token", token);
    navigate("/job-seeker/dashboard");

    setMessage("Login successful! 🎉");

    console.log("JWT Token:", token);

  } catch (error) {
    console.error(error);

    if (error.response) {
      setMessage(error.response.data);
    } else {
      setMessage("Something went wrong!");
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

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;