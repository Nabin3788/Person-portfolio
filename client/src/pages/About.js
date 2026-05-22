import React from "react";
import "./Home/Home.css";

const About = () => {
  return (
    <main className="home-page">
      <section className="hero-panel about-panel">
        <div className="hero-background" />
        <div className="hero-content about-content">
          <span className="eyebrow">About Gobinda Acharya</span>
          <h1>Passionate software developer and AI enthusiast from Nepal.</h1>
          <p className="hero-copy">
            I transform ideas into practical applications that solve real-world problems through clean,
            scalable, and efficient technology. My main focus is building modern web applications,
            intelligent systems, and AI-powered products.
          </p>
          <div className="home-buttons">
            <a href="mailto:hello@gobinda.dev" className="btn btn-hire">Connect with me</a>
            <a href="/projects" className="btn btn-cv">View projects</a>
          </div>
          <div className="hero-tags about-tags">
            <span>MERN Stack</span>
            <span>Python</span>
            <span>AI / ML</span>
            <span>Computer Vision</span>
            <span>Cloud</span>
            <span>Firebase</span>
          </div>
        </div>
      </section>

      <section className="section-panel profile-grid">
        <article className="profile-card fade-up">
          <h2>Who I am</h2>
          <p>
            I am a software developer who enjoys building full-stack applications, backend services,
            and intelligent systems. I deeply explore how AI models learn patterns and how to make
            them deployable, efficient, and user-friendly.
          </p>
          <p>
            I speak the language of code, data, and product thinking. My strengths are curiosity,
            persistence, analytical problem-solving, and producing practical solutions.
          </p>
        </article>

        <article className="profile-card fade-up delay-1">
          <h2>What I build</h2>
          <ul>
            <li>Responsive web applications with React, Node.js, Express, and MongoDB</li>
            <li>Secure auth systems, REST APIs, and admin workflows</li>
            <li>AI-powered tools using TensorFlow, PyTorch, and computer vision</li>
            <li>Multilingual support, Firebase integrations, and scalable cloud apps</li>
          </ul>
        </article>

        <article className="profile-card fade-up delay-2">
          <h2>Herboscope</h2>
          <p>
            Herboscope is an AI-driven platform for identifying Nepalese medicinal plants from leaf images.
            It uses deep learning, transfer learning, MobileNetV2, data augmentation, and intelligent search to
            deliver accurate and user-friendly plant recognition.
          </p>
        </article>
      </section>

      <section className="section-panel skills-panel fade-up delay-3">
        <h2 className="section-heading">Technologies & tools</h2>
        <div className="skill-grid">
          {[
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Python",
            "TensorFlow",
            "PyTorch",
            "Firebase",
            "Jupyter Notebook",
            "REST APIs",
            "Computer Vision",
            "MobileNetV2",
          ].map((skill) => (
            <span key={skill} className="tech-tag">{skill}</span>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
