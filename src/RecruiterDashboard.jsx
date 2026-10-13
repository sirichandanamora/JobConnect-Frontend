
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecruiterDashboard.css";

const API_URL = "https://jobconnect-backend-u4x3.onrender.com/api";

const EMPTY_FORM = {
  title: "",
  company: "",
  description: "",
  location: "",
  salary: "",
  skills: "",
  jobType: "Full Time",
};

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recruiterId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected jobs response");
      }

      setJobs(response.data);
      return true;
    } catch (err) {
      console.error("Fetch jobs failed:", err);
      setError("Unable to load jobs. Please refresh the page.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/applications`);
      setApplications(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Fetch applications failed:", err);
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  const handleChange = (e) => {
    setJobForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!recruiterId || !Number.isFinite(recruiterId)) {
      setError("Your user ID is missing. Please log in again.");
      return;
    }

    if (role !== "RECRUITER") {
      setError("Please log in using a recruiter account.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/jobs`, {
        ...jobForm,
        recruiter: { id: recruiterId },
      });

      setMessage("Job posted successfully!");
      setJobForm({ ...EMPTY_FORM });
      setShowForm(false);

      // Add the saved job immediately, then refresh from the database.
      if (response.data?.id) {
        setJobs((previous) => [
          response.data,
          ...previous.filter((job) => job.id !== response.data.id),
        ]);
      }

      await fetchJobs();
    } catch (err) {
      console.error(
        "Post job failed:",
        err.response?.data || err.message
      );

      const data = err.response?.data;
      setError(
        typeof data === "string"
          ? data
          : data?.message || "Job posting failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`);
      setJobs((previous) =>
        previous.filter((job) => job.id !== jobId)
      );
      setMessage("Job deleted successfully.");
    } catch (err) {
      console.error("Delete job failed:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to delete job."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/login");
  };

  // Compare IDs numerically because API and localStorage types can differ.
  const recruiterJobs = jobs.filter(
    (job) => Number(job.recruiter?.id) === recruiterId
  );

  const recruiterApplications = applications.filter(
    (application) =>
      Number(application.job?.recruiter?.id) === recruiterId
  );

  if (role !== "RECRUITER" || !recruiterId) {
    return (
      <div className="recruiter-page">
        <h2>Recruiter login required</h2>
        <p>Please log in with your recruiter account.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      <nav className="recruiter-navbar">
        <div className="recruiter-brand">💼 JobConnect</div>

        <div className="recruiter-nav-links">
          <button
            onClick={() =>
              document.getElementById("my-jobs")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            My Jobs
          </button>

          <button
            onClick={() =>
              document.getElementById("applications")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Applications
          </button>

          <button className="recruiter-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="recruiter-hero">
        <div>
          <span className="recruiter-badge">👨‍💼 RECRUITER PORTAL</span>
          <h1>Recruit the Right Talent</h1>
          <p>
            Post opportunities, manage your jobs, and find talented
            candidates.
          </p>

          <button
            className="post-job-main-btn"
            onClick={() => {
              setMessage("");
              setError("");
              setShowForm((previous) => !previous);
            }}
          >
            + Post New Job
          </button>
        </div>
      </section>

      {message && (
        <div className="recruiter-success" role="status">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="recruiter-error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <section className="post-job-section">
          <div className="post-job-card">
            <div className="form-header">
              <div>
                <span className="section-label">NEW OPPORTUNITY</span>
                <h2>Post a Job</h2>
                <p>Add details about your job opening.</p>
              </div>

              <button
                type="button"
                className="close-form-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJob}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input
                    id="title"
                    name="title"
                    value={jobForm.title}
                    onChange={handleChange}
                    placeholder="e.g. Java Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    value={jobForm.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={jobForm.location}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Salary</label>
                  <input
                    id="salary"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleChange}
                    placeholder="e.g. 6-10 LPA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Skills</label>
                  <input
                    id="skills"
                    name="skills"
                    value={jobForm.skills}
                    onChange={handleChange}
                    placeholder="Java, Spring Boot, SQL"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jobType">Job Type</label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={jobForm.jobType}
                    onChange={handleChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Job Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={jobForm.description}
                  onChange={handleChange}
                  placeholder="Describe the role and responsibilities..."
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-job-btn"
                disabled={submitting}
              >
                {submitting ? "Publishing..." : "Publish Job"}
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="recruiter-stats">
        <div className="stat-card">
          <span>💼</span>
          <div>
            <strong>{recruiterJobs.length}</strong>
            <p>Jobs Posted</p>
          </div>
        </div>

        <div className="stat-card">
          <span>📋</span>
          <div>
            <strong>{recruiterApplications.length}</strong>
            <p>Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <span>👥</span>
          <div>
            <strong>
              {
                new Set(
                  recruiterApplications
                    .map((application) => application.applicant?.id)
                    .filter((id) => id != null)
                ).size
              }
            </strong>
            <p>Candidates</p>
          </div>
        </div>
      </section>

      <section id="my-jobs" className="recruiter-section">
        <div className="section-heading">
          <div>
            <span className="section-label">JOB MANAGEMENT</span>
            <h2>My Job Postings</h2>
            <p>Manage the opportunities you've posted.</p>
          </div>

          <button
            className="small-post-btn"
            onClick={() => setShowForm(true)}
          >
            + Post Job
          </button>
        </div>

        {loading ? (
          <div className="recruiter-loading">Loading jobs...</div>
        ) : recruiterJobs.length === 0 ? (
          <div className="recruiter-empty">
            <div>💼</div>
            <h3>No jobs posted yet</h3>
            <p>Post a job to see it here and on the jobs page.</p>
            <button
              className="post-job-main-btn"
              onClick={() => setShowForm(true)}
            >
              + Post New Job
            </button>
          </div>
        ) : (
          <div className="recruiter-jobs">
            {recruiterJobs.map((job) => (
              <div className="recruiter-job-card" key={job.id}>
                <div className="job-company-icon">
                  {job.company?.charAt(0)?.toUpperCase() || "J"}
                </div>

                <div className="recruiter-job-info">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>

                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary || "Not specified"}</span>
                    <span>💼 {job.jobType || "Not specified"}</span>
                  </div>

                  <div className="job-skills">{job.skills}</div>
                </div>

                <div className="job-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/jobs/${job.id}`)
                    }
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        id="applications"
        className="recruiter-applications-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">CANDIDATES</span>
            <h2>Applications</h2>
            <p>Review candidates who applied to your jobs.</p>
          </div>
        </div>

        {recruiterApplications.length === 0 ? (
          <div className="recruiter-empty">
            <div>📋</div>
            <h3>No applications yet</h3>
            <p>Applications from candidates will appear here.</p>
          </div>
        ) : (
          <div className="applications-table">
            <div className="table-header">
              <span>Candidate</span>
              <span>Job</span>
              <span>Status</span>
              <span>Applied On</span>
            </div>

            {recruiterApplications.map((application) => (
              <div className="application-row" key={application.id}>
                <div>
                  <strong>
                    {application.applicant?.name || "Candidate"}
                  </strong>
                  <small>{application.applicant?.email || ""}</small>
                </div>

                <span>{application.job?.title || "Job"}</span>
                <span className="application-status">
                  {application.status || "Pending"}
                </span>
                <span>
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="recruiter-footer">
        <strong>💼 JobConnect</strong>
        <p>Connecting recruiters with talented candidates.</p>
        <small>© 2026 JobConnect. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default RecruiterDashboard;
