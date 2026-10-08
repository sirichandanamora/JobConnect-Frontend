import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/jobs/${id}`
      );

      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Job not found");
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading job...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>{job.title}</h2>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Salary:</strong> {job.salary}
      </p>

      <p>
        <strong>Skills:</strong> {job.skills}
      </p>

      <p>
        <strong>Job Type:</strong> {job.jobType}
      </p>

      <h3>Job Description</h3>

      <p>{job.description}</p>

      <br />

      <button onClick={() => navigate(`/jobs/${job.id}/apply`)}>
        Apply Now
      </button>

      <button onClick={() => navigate("/jobs")}>
        Back to Jobs
      </button>
    </div>
  );
}

export default JobDetails;