import React from "react";
import "./Home/Home.css";

const Experience = () => {
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Experience</span>
          <h1>Years of shipping polished web products.</h1>
          <p className="hero-copy">
            My work spans full-stack product delivery, motion-led interfaces, and performance optimization for modern digital experiences.
          </p>
        </div>
      </section>

      <section className="section-panel">
        <h2 className="section-heading">Proven outcomes</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <h3>5+</h3>
            <p>Years building responsive React applications for SaaS and consumer products.</p>
          </div>
          <div className="stat-card">
            <h3>20+</h3>
            <p>Interfaces improved through animation, usability, and performance tuning.</p>
          </div>
          <div className="stat-card">
            <h3>15+</h3>
            <p>Projects delivered with clean UI, component-driven structure, and clear roadmaps.</p>
          </div>
        </div>
      </section>

      <section className="section-panel">
        <h2 className="section-heading">Core strengths</h2>
        <p>
          I bring a strong foundation in modern JavaScript, API design, responsive layouts, and product thinking so your next app launch feels polished and purposeful.
        </p>
      </section>
    </main>
  );
};

export default Experience;
