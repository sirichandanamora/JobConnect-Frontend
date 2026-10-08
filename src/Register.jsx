import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOB_SEEKER"
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
        "http://localhost:8080/api/auth/register",
        formData
      );

      console.log(response.data);
      setMessage("Registration successful! 🎉");

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
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br /><br />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="RECRUITER">Recruiter</option>
        </select>

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default Register;