import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recruiterId = 2;

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "Full Time"
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "https://https://jobconnect-backend-u4x3.onrender.com/api/jobs"
      );

      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load jobs");
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "https://https://jobconnect-backend-u4x3.onrender.com/api/applications"
      );

      setApplications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await axios.post(
        "https://https://jobconnect-backend-u4x3.onrender.com/api/jobs",
        {
          ...jobForm,
          recruiter: {
            id: recruiterId
          }
        }
      );

      setMessage("Job posted successfully! 🎉");

      setJobForm({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
        skills: "",
        jobType: "Full Time"
      });

      setShowForm(false);

      fetchJobs();

    } catch (error) {
      console.error(error);
      setError("Failed to post job");
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://https://jobconnect-backend-u4x3.onrender.com/api/jobs/${jobId}`
      );

      setMessage("Job deleted successfully!");

      fetchJobs();

    } catch (error) {
      console.error(error);
      setError("Failed to delete job");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const recruiterJobs = jobs.filter(
    (job) =>
      job.recruiter &&
      job.recruiter.id === recruiterId
  );

  const recruiterApplications = applications.filter(
    (application) =>
      application.job &&
      application.job.recruiter &&
      application.job.recruiter.id === recruiterId
  );

  return (
    <div className="recruiter-page">

      {/* NAVBAR */}
      <nav className="recruiter-navbar">

        <div className="recruiter-brand">
          💼 JobConnect
        </div>

        <div className="recruiter-nav-links">

          <button
            onClick={() =>
              document
                .getElementById("my-jobs")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            My Jobs
          </button>

          <button
            onClick={() =>
              document
                .getElementById("applications")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            Applications
          </button>

          <button
            className="recruiter-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* HERO */}
      <section className="recruiter-hero">

        <div>

          <span className="recruiter-badge">
            👨‍💼 RECRUITER PORTAL
          </span>

          <h1>
            Recruit the Right Talent
          </h1>

          <p>
            Post opportunities, manage your jobs,
            and find talented candidates.
          </p>

          <button
            className="post-job-main-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Post New Job
          </button>

        </div>

      </section>

      {/* MESSAGES */}
      {message && (
        <div className="recruiter-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="recruiter-error">
          {error}
        </div>
      )}

      {/* POST JOB FORM */}
      {showForm && (

        <section className="post-job-section">

          <div className="post-job-card">

            <div className="form-header">
              <div>
                <span className="section-label">
                  NEW OPPORTUNITY
                </span>

                <h2>Post a Job</h2>

                <p>
                  Add details about your job opening.
                </p>
              </div>

              <button
                className="close-form-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJob}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Job Title</label>

                  <input
                    name="title"
                    value={jobForm.title}
                    onChange={handleChange}
                    placeholder="e.g. Java Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>

                  <input
                    name="company"
                    value={jobForm.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>

                  <input
                    name="location"
                    value={jobForm.location}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Salary</label>

                  <input
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleChange}
                    placeholder="e.g. 6-10 LPA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Skills</label>

                  <input
                    name="skills"
                    value={jobForm.skills}
                    onChange={handleChange}
                    placeholder="Java, Spring Boot, SQL"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Type</label>

                  <select
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
                <label>Job Description</label>

                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleChange}
                  placeholder="Describe the role and responsibilities..."
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-job-btn"
              >
                Publish Job
              </button>

            </form>

          </div>

        </section>
      )}

      {/* STATISTICS */}
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
              {new Set(
                recruiterApplications.map(
                  (application) =>
                    application.applicant?.id
                )
              ).size}
            </strong>
            <p>Candidates</p>
          </div>
        </div>

      </section>

      {/* MY JOBS */}
      <section
        id="my-jobs"
        className="recruiter-section"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              JOB MANAGEMENT
            </span>

            <h2>My Job Postings</h2>

            <p>
              Manage the opportunities you've posted.
            </p>
          </div>

          <button
            className="small-post-btn"
            onClick={() => setShowForm(true)}
          >
            + Post Job
          </button>

        </div>

        {loading ? (

          <div className="recruiter-loading">
            Loading jobs...
          </div>

        ) : recruiterJobs.length === 0 ? (

          <div className="recruiter-empty">
            <div>💼</div>

            <h3>No jobs posted yet</h3>

            <p>
              Create your first job opportunity.
            </p>

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

              <div
                className="recruiter-job-card"
                key={job.id}
              >

                <div className="job-company-icon">
                  {job.company
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="recruiter-job-info">

                  <h3>{job.title}</h3>

                  <p className="company">
                    {job.company}
                  </p>

                  <div className="job-meta">
                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💰 {job.salary}
                    </span>

                    <span>
                      💼 {job.jobType}
                    </span>
                  </div>

                  <div className="job-skills">
                    {job.skills}
                  </div>

                </div>

                <div className="job-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      alert(
                        "Edit Job feature coming next!"
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteJob(job.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* APPLICATIONS */}
      <section
        id="applications"
        className="recruiter-applications-section"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              CANDIDATES
            </span>

            <h2>Applications</h2>

            <p>
              Review candidates who applied to your jobs.
            </p>
          </div>

        </div>

        {recruiterApplications.length === 0 ? (

          <div className="recruiter-empty">
            <div>📋</div>

            <h3>No applications yet</h3>

            <p>
              Applications from candidates will appear here.
            </p>
          </div>

        ) : (

          <div className="applications-table">

            <div className="table-header">
              <span>Candidate</span>
              <span>Job</span>
              <span>Status</span>
              <span>Applied On</span>
            </div>

            {recruiterApplications.map(
              (application) => (

                <div
                  className="application-row"
                  key={application.id}
                >

                  <div>
                    <strong>
                      {application.applicant?.name}
                    </strong>

                    <small>
                      {application.applicant?.email}
                    </small>
                  </div>

                  <span>
                    {application.job.title}
                  </span>

                  <span className="application-status">
                    {application.status}
                  </span>

                  <span>
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString()}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer className="recruiter-footer">

        <strong>💼 JobConnect</strong>

        <p>
          Connecting recruiters with talented candidates.
        </p>

        <small>
          © 2026 JobConnect. All rights reserved.
        </small>

      </footer>

    </div>
  );
}

export default RecruiterDashboard;