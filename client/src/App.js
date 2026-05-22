import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Stack from './pages/Stack';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projects" element={<Projects />} />
          <Route path="stack" element={<Stack />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Auth />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
