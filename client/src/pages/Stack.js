import React from "react";
import "./Home/Home.css";

const Stack = () => {
  const stackItems = [
    "React",
    "JavaScript",
    "CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "TypeScript",
    "Tailwind",
    "REST / GraphQL",
    "Vite",
  ];

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Tech Stack</span>
          <h1>Tools I use to ship polished front-end experiences.</h1>
          <p className="hero-copy">
            I combine modern UI frameworks, accessible patterns, and performance-minded architecture for sustainable product delivery.
          </p>
        </div>
      </section>

      <section className="section-panel">
        <h2 className="section-heading">Primary technologies</h2>
        <div className="tag-grid">
          {stackItems.map((item) => (
            <span key={item} className="tech-tag">{item}</span>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Stack;
