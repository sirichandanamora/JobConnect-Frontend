
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://jobconnect-backend-u4x3.onrender.com/api/jobs";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(API_URL);

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected jobs response");
        }

        setJobs(response.data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError(
          "Unable to load jobs. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = String(job.title ?? "").toLowerCase();
    const company = String(job.company ?? "").toLowerCase();
    const jobLocation = String(job.location ?? "").toLowerCase();

    const matchesSearch =
      title.includes(search.toLowerCase()) ||
      company.includes(search.toLowerCase());

    const matchesLocation =
      jobLocation.includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return <h2>Loading jobs...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>{error}</h2>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>JobConnect</h1>
      <h2>Available Jobs</h2>

      <input
        type="text"
        placeholder="Search job or company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {jobs.length === 0 ? (
        <p>
          No jobs have been posted yet. Please check back later.
        </p>
      ) : filteredJobs.length === 0 ? (
        <p>No matching jobs found. Try another search.</p>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              margin: "15px 0",
              maxWidth: "500px",
              borderRadius: "8px",
            }}
          >
            <h3>{job.title || "Untitled Job"}</h3>
            <p>
              <strong>Company:</strong> {job.company || "Not specified"}
            </p>
            <p>
              <strong>Location:</strong> {job.location || "Not specified"}
            </p>
            <p>
              <strong>Salary:</strong> {job.salary ?? "Not specified"}
            </p>
            <p>
              <strong>Skills:</strong> {job.skills || "Not specified"}
            </p>
            <p>
              <strong>Job Type:</strong> {job.jobType || "Not specified"}
            </p>
            <p>{job.description}</p>

            <button
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Jobs;
