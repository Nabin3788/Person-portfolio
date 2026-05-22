import React from "react";
import "./Home/Home.css";

const Projects = () => {
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Featured work</span>
          <h1>Project experiences built for real users.</h1>
          <p className="hero-copy">
            Browse a selection of product-focused web apps with polished interfaces, strong UX, and reliable performance.
          </p>
        </div>
      </section>

      <section className="section-panel">
        <h2 className="section-heading">Recent projects</h2>
        <div className="project-grid">
          <article className="project-card">
            <h3>Herboscope</h3>
            <p>An AI-powered plant health dashboard that detects diseases, suggests care, and visualizes growth patterns.</p>
            <a className="project-link" href="mailto:hello@nabin.dev">Discuss</a>
          </article>
          <article className="project-card">
            <h3>Todos</h3>
            <p>A prioritized task manager with drag-and-drop sorting, dark mode, and deadline reminders for daily productivity.</p>
            <a className="project-link" href="mailto:hello@nabin.dev">Discuss</a>
          </article>
          <article className="project-card">
            <h3>Bike Rental</h3>
            <p>A sleek rental booking experience with real-time availability, route preview, and fast checkout flows.</p>
            <a className="project-link" href="mailto:hello@nabin.dev">Discuss</a>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Projects;
