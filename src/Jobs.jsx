import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/jobs"
      );

      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load jobs");
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      job.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return <h2>Loading jobs...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>JobConnect</h1>

      <h2>Available Jobs</h2>

      <div>
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
      </div>

      <br />

      {filteredJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid black",
              padding: "20px",
              margin: "15px 0",
              maxWidth: "500px"
            }}
          >
            <h3>{job.title}</h3>

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