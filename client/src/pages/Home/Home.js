import React from "react";
import Typewriter from "typewriter-effect";
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiTwitter } from "react-icons/fi";
import Resume from "../../components/Assets/docs/resume.txt";
import HeroImage from "../../components/Assets/pic.jpeg";
import './Home.css';

const Home = () => {

  return (
    <main className="home-page">
      <section id="home" className="hero-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">AI-powered full-stack engineering</span>
          <h1>
            Hi, I'm Gobinda — <span>software developer & AI enthusiast</span>
          </h1>
          <h2>
            <Typewriter
              options={{
                strings: [
                  "MERN Stack Developer",
                  "Machine Learning Engineer",
                  "Computer Vision Specialist",
                  "Intelligent Systems Builder",
                ],
                autoStart: true,
                loop: true,
                pauseFor: 2200,
              }}
            />
          </h2>
          <p className="hero-copy">
            I transform ideas into practical, scalable applications that combine clean interfaces, powerful backend systems,
            and AI-driven intelligence for real-world impact.
          </p>

          <div className="home-buttons">
            <a href="mailto:hello@gobinda.dev" className="btn btn-hire">Let's collaborate</a>
            <a className="btn btn-cv" href={Resume} download="gobinda-resume.txt">Download resume</a>
          </div>

          <div className="hero-tags">
            <span>React.js</span>
            <span>Node.js</span>
            <span>TensorFlow</span>
            <span>Computer Vision</span>
            <span>MongoDB</span>
          </div>
        </div>

        <div className="hero-image">
          <img src={HeroImage} alt="Gobinda Acharya portfolio" />
        </div>
      </section>

      <section id="about" className="section-panel">
        <h2 className="section-heading">About Gobinda</h2>
        <p>
          I specialize in building modern web applications and AI systems that solve problems with clean architecture,
          intelligent automation, and polished user experiences.
          My work spans full-stack development, backend engineering, machine learning, computer vision, and scalable cloud-enabled apps.
        </p>
        <div className="stat-grid" style={{ marginTop: '30px' }}>
          <div className="stat-card">
            <h3>Full-stack</h3>
            <p>MERN, REST APIs, authentication, and responsive front-end design.</p>
          </div>
          <div className="stat-card">
            <h3>AI/ML</h3>
            <p>Deep learning models, transfer learning, data preprocessing, and deployment.</p>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <p>Smart apps, image recognition systems, and production-ready backend services.</p>
          </div>
        </div>
      </section>

      <section id="specialties" className="section-panel">
        <h2 className="section-heading">Core specialties</h2>
        <div className="tag-grid">
          {[
            'MERN Stack',
            'Python / ML',
            'Computer Vision',
            'Deep Learning',
            'MobileNetV2',
            'Firebase',
            'JWT Auth',
            'API Design',
          ].map((item) => (
            <span key={item} className="tech-tag">{item}</span>
          ))}
        </div>
      </section>

      <section id="highlight" className="section-panel">
        <h2 className="section-heading">Highlighted work</h2>
        <div className="project-grid">
          <article className="project-card">
            <h3>Herboscope</h3>
            <p>
              An AI-powered medicinal plant identification platform built for Nepalese herbs.
              The system uses deep learning and computer vision to classify plants from leaf images,
              provide botanical details, and support multilingual users.
            </p>
            <a className="project-link" href="#contact">Discuss this idea</a>
          </article>
          <article className="project-card">
            <h3>Intelligent Portfolio</h3>
            <p>
              Modern portfolio with secure authentication, admin response handling, notification workflows,
              and backend connectivity for a polished end-to-end experience.
            </p>
            <a className="project-link" href="#contact">Ask about this</a>
          </article>
          <article className="project-card">
            <h3>Task Manager</h3>
            <p>
              A productivity app focused on task organization, user workflows, and responsive project management.
              It includes features for secure login and efficient updates.
            </p>
            <a className="project-link" href="#contact">Review this</a>
          </article>
          <article className="project-card">
            <h3>AI Search Engine</h3>
            <p>
              Intelligent search with semantic matching, relevance ranking, and clean analytics for smarter discovery.
              Built for fast queries and actionable results.
            </p>
            <a className="project-link" href="#contact">Talk about this</a>
          </article>
        </div>
      </section>

      <section id="stack" className="section-panel">
        <h2 className="section-heading">Tech stack</h2>
        <div className="tag-grid">
          {['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'TensorFlow', 'PyTorch', 'Firebase', 'Docker', 'Git'].map((item) => (
            <span key={item} className="tech-tag">{item}</span>
          ))}
        </div>
      </section>

      <section id="contact" className="section-panel contact-panel">
        <div>
          <h2 className="section-heading">Ready to build?</h2>
          <p>Let's design and ship high-quality software that blends intelligent systems with clean product experiences.</p>
        </div>
        <a className="btn btn-hire contact-btn" href="mailto:hello@gobinda.dev">Contact Me</a>
      </section>

      <footer className="info-footer">
        <div className="footer-branding">
          <p className="footer-title">Gobinda Acharya</p>
          <p className="footer-copy">Building intelligent, scalable, and user-focused applications with AI and modern web development.</p>
        </div>

        <div className="footer-card">
          <h3>Connect</h3>
          <div className="footer-row">
            <FiMail />
            <span>hello@gobinda.dev</span>
          </div>
          <div className="footer-row">
            <FiPhone />
            <span>Remote / Nepal</span>
          </div>
          <div className="footer-row">
            <FiMapPin />
            <span>Cloud-first delivery</span>
          </div>
        </div>

        <div className="footer-card">
          <h3>Profiles</h3>
          <div className="social-list">
            <a className="social-link" href="https://linkedin.com/in/gobinda-acharya" target="_blank" rel="noreferrer">
              <FiLinkedin /> linkedin.com/in/gobinda-acharya
            </a>
            <a className="social-link" href="https://github.com/gobinda-acharya" target="_blank" rel="noreferrer">
              <FiGithub /> github.com/gobinda-acharya
            </a>
            <a className="social-link" href="https://twitter.com/gobinda_ai" target="_blank" rel="noreferrer">
              <FiTwitter /> @gobinda_ai
            </a>
          </div>
        </div>
      </footer>

      <div className="footer-note">
        <span>© {new Date().getFullYear()} Gobinda Acharya. Built for AI-driven applications and modern software craft.</span>
      </div>
    </main>
  );
};

export default Home;
