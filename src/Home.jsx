
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          💼 JobConnect
        </Link>

        <div className="home-nav-links">
          <Link to="/jobs">Jobs</Link>
          <a href="#about">About</a>
        </div>

        <div className="home-auth-buttons">
          <Link to="/register" className="register-btn">
            Register
          </Link>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>

      <main className="home-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-tagline">
              YOUR CAREER. YOUR FUTURE.
            </p>

            <h1>
              Find Your Next
              <span> Opportunity</span>
            </h1>

            <p className="hero-description">
              JobConnect connects talented individuals with great
              companies. Build your career, hire the best, and grow
              together.
            </p>

            <div className="hero-buttons">
              <Link to="/jobs" className="primary-btn">
                Explore Jobs
              </Link>
              <Link to="/register" className="secondary-btn">
                Get Started
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>Discover</strong>
                <span>Job Opportunities</span>
              </div>
              <div>
                <strong>Connect</strong>
                <span>With Employers</span>
              </div>
              <div>
                <strong>Grow</strong>
                <span>Your Career</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="home-about" id="about">
        <h2>Your next opportunity starts here.</h2>
        <p>
          Explore job openings, connect with employers, and manage
          your career journey in one place.
        </p>
        <Link to="/jobs" className="primary-btn">
          Browse Jobs
        </Link>
      </section>
    </div>
  );
}

export default Home;