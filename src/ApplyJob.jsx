import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicantId, setApplicantId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!applicantId) {
      setError("Please enter your User ID");
      return;
    }

   try {
       await axios.post(
         `https://jobconnect-backend-u4x3.onrender.com/api/applications?jobId=${id}&applicantId=${applicantId}`
  );

      setMessage("Application submitted successfully! 🎉");

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Failed to submit application");
      }
    }
  };

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>Apply for Job</h2>

      <form onSubmit={handleApply}>

        <div>
          <label>User ID</label>
          <br />

          <input
            type="number"
            placeholder="Enter your User ID"
            value={applicantId}
            onChange={(e) => setApplicantId(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Submit Application
        </button>

      </form>

      <br />

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <button onClick={() => navigate(`/jobs/${id}`)}>
        Back to Job
      </button>
    </div>
  );
}

export default ApplyJob;