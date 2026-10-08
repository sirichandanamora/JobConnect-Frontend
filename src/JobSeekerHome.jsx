import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobSeekerHome.css";

function JobSeekerHome() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Temporary user ID.
  // Later we will get this automatically from JWT.
  const userId = 1;

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/jobs"
      );

      setJobs(response.data);
      setLoadingJobs(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load jobs");
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/applications/user/${userId}`
      );

      setApplications(response.data);
      setLoadingApplications(false);
    } catch (error) {
      console.error(error);
      setLoadingApplications(false);
    }
  };

  const hasApplied = (jobId) => {
    return applications.some(
      (application) => application.job.id === jobId
    );
  };

  const applyForJob = async (jobId) => {
    setMessage("");
    setError("");

    if (hasApplied(jobId)) {
      setError("You have already applied for this job.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/applications?jobId=${jobId}&applicantId=${userId}`
      );

      setMessage("Application submitted successfully!");

      await fetchApplications();

      setSelectedJob(null);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Failed to submit application");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();
    const locationText = location.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText) ||
      (job.skills &&
        job.skills.toLowerCase().includes(searchText));

    const matchesLocation =
      job.location.toLowerCase().includes(locationText);

    return matchesSearch && matchesLocation;
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="jobseeker-page">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="brand">
          <span className="brand-icon">💼</span>
          JobConnect
        </div>

        <div className="nav-links">
          <button onClick={() => scrollToSection("jobs")}>
            Find Jobs
          </button>

          <button onClick={() => scrollToSection("applications")}>
            My Applications
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Your career starts here
          </span>

          <h1>
            Find Your
            <span> Dream Job</span>
          </h1>

          <p>
            Discover exciting opportunities from companies
            looking for talented people like you.
          </p>

          <div className="search-box">

            <div className="search-field">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Job title, company or skill"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="search-field">
              <span>📍</span>

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              className="search-btn"
              onClick={() => scrollToSection("jobs")}
            >
              Search Jobs
            </button>

          </div>

        </div>

      </section>

      {/* MESSAGES */}
      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* JOBS */}
      <section
        id="jobs"
        className="section"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              OPPORTUNITIES
            </span>

            <h2>Latest Job Openings</h2>

            <p>
              Find the perfect opportunity for your career.
            </p>
          </div>

          <span className="job-count">
            {filteredJobs.length} Jobs
          </span>

        </div>

        {loadingJobs ? (
          <div className="loading">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div>🔎</div>
            <h3>No jobs found</h3>
            <p>
              Try changing your search or location.
            </p>
          </div>
        ) : (

          <div className="jobs-grid">

            {filteredJobs.map((job) => (

              <div
                className="job-card"
                key={job.id}
              >

                <div className="company-icon">
                  {job.company?.charAt(0).toUpperCase()}
                </div>

                <div className="job-card-content">

                  <div className="job-top">

                    <div>
                      <h3>{job.title}</h3>

                      <p className="company-name">
                        {job.company}
                      </p>
                    </div>

                    {hasApplied(job.id) && (
                      <span className="applied-badge">
                        ✓ Applied
                      </span>
                    )}

                  </div>

                  <div className="job-info">

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

                  <div className="skills">
                    {job.skills &&
                      job.skills
                        .split(",")
                        .slice(0, 4)
                        .map((skill, index) => (
                          <span key={index}>
                            {skill.trim()}
                          </span>
                        ))}
                  </div>

                  <div className="card-actions">

                    <button
                      className="details-btn"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                    >
                      View Details
                    </button>

                    <button
                      className={
                        hasApplied(job.id)
                          ? "applied-btn"
                          : "apply-btn"
                      }
                      disabled={hasApplied(job.id)}
                      onClick={() =>
                        applyForJob(job.id)
                      }
                    >
                      {hasApplied(job.id)
                        ? "Applied ✓"
                        : "Apply Now"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* APPLICATIONS */}
      <section
        id="applications"
        className="applications-section"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              YOUR ACTIVITY
            </span>

            <h2>My Applications</h2>

            <p>
              Track the jobs you've applied for.
            </p>
          </div>

          <span className="application-count">
            {applications.length} Applications
          </span>

        </div>

        {loadingApplications ? (
          <div className="loading">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (

          <div className="empty-state">
            <div>📋</div>

            <h3>No applications yet</h3>

            <p>
              Start exploring jobs and apply to your
              favorite opportunities.
            </p>

            <button
              className="apply-btn"
              onClick={() => scrollToSection("jobs")}
            >
              Browse Jobs
            </button>
          </div>

        ) : (

          <div className="applications-list">

            {applications.map((application) => (

              <div
                className="application-card"
                key={application.id}
              >

                <div className="application-company-icon">
                  {application.job.company
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="application-info">

                  <h3>
                    {application.job.title}
                  </h3>

                  <p>
                    {application.job.company}
                  </p>

                  <span>
                    📍 {application.job.location}
                  </span>

                </div>

                <div className="application-status">

                  <span className="status-label">
                    STATUS
                  </span>

                  <span className="status-badge">
                    {application.status}
                  </span>

                </div>

                <div className="application-date">

                  <span className="status-label">
                    APPLIED ON
                  </span>

                  <span>
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <button
                  className="view-job-btn"
                  onClick={() => {
                    const job = jobs.find(
                      (j) =>
                        j.id === application.job.id
                    );

                    if (job) {
                      setSelectedJob(job);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                      });
                    }
                  }}
                >
                  View Job
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-brand">
          💼 JobConnect
        </div>

        <p>
          Connecting talented people with great
          opportunities.
        </p>

        <span>
          © 2026 JobConnect. All rights reserved.
        </span>

      </footer>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedJob(null)}
        >

          <div
            className="job-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>

            <div className="modal-company-icon">
              {selectedJob.company
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <h2>
              {selectedJob.title}
            </h2>

            <p className="modal-company">
              {selectedJob.company}
            </p>

            <div className="modal-details">

              <span>
                📍 {selectedJob.location}
              </span>

              <span>
                💰 {selectedJob.salary}
              </span>

              <span>
                💼 {selectedJob.jobType}
              </span>

            </div>

            <h3>
              Required Skills
            </h3>

            <div className="skills modal-skills">
              {selectedJob.skills &&
                selectedJob.skills
                  .split(",")
                  .map((skill, index) => (
                    <span key={index}>
                      {skill.trim()}
                    </span>
                  ))}
            </div>

            <h3>
              Job Description
            </h3>

            <p className="description">
              {selectedJob.description}
            </p>

            <div className="modal-actions">

              <button
                className={
                  hasApplied(selectedJob.id)
                    ? "applied-btn"
                    : "apply-btn"
                }
                disabled={hasApplied(selectedJob.id)}
                onClick={() =>
                  applyForJob(selectedJob.id)
                }
              >
                {hasApplied(selectedJob.id)
                  ? "Application Submitted ✓"
                  : "Apply for this Job"}
              </button>

              <button
                className="details-btn"
                onClick={() =>
                  setSelectedJob(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default JobSeekerHome;