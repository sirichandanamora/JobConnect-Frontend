import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary user ID
  // Later we will get this automatically from JWT
  const userId = 1;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/applications/user/${userId}`
      );

      setApplications(response.data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setError("Failed to load applications");
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <div>
          <p>You haven't applied for any jobs yet.</p>

          <button onClick={() => navigate("/jobs")}>
            Browse Jobs
          </button>
        </div>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid black",
              padding: "20px",
              margin: "15px 0",
              maxWidth: "600px"
            }}
          >
            <h3>
              {application.job.title}
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.job.company}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {application.job.location}
            </p>

            <p>
              <strong>Job Type:</strong>{" "}
              {application.job.jobType}
            </p>

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(application.appliedAt).toLocaleString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <button
              onClick={() =>
                navigate(`/jobs/${application.job.id}`)
              }
            >
              View Job
            </button>
          </div>
        ))
      )}

      <br />

      <button onClick={() => navigate("/job-seeker/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default MyApplications;