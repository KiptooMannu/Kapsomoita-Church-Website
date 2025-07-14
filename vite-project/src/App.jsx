import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import About from './Pages/About';
import Youth from './Pages/ministries/Youth';
import Women from './Pages/ministries/Women';
import Men from './Pages/ministries/Men';
import Kids from './Pages/ministries/Kids';
import Sermons from './Pages/Sermons';
import Gallery from './Pages/Gallery';
import Contact from './Pages/Contacts'; // Import the Contact component
import Evangelizing from "./Pages/strategies/Evangelizing";
import Establishing from "./Pages/strategies/Establishing";
import Edifying from "./Pages/strategies/Edifying";
import Equipping from "./Pages/strategies/Equipping";
import Compassion from "./Pages/strategies/Compassion";


function App() {
  const location = useLocation();

  // Handle scroll to section when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    } else if (location.pathname === '/') {
      // Scroll to top when coming from another page to home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="relative">
      <Navbar/>
      
      <Routes>
        {/* Single Page Application Routes */}
        <Route path="/" element={
          <>
            <section id="home" className="scroll-mt-20">
              <HeroSection/>
            </section>
            
            <section id="about" className="scroll-mt-20">
              <About/>
            </section>
            
            <section id="sermons" className="scroll-mt-20">
              <Sermons/>
            </section>

            <section id="gallery" className="scroll-mt-20">
              <Gallery asHomeSection={true} />
            </section>

            <section id="contact" className="scroll-mt-20">
              <Contact asHomeSection={true} />
            </section>

            {/* Uncomment these as you implement them */}
            {/* <section id="ministries" className="scroll-mt-20">
              <Ministries/>
            </section>
            
            <section id="events" className="scroll-mt-20">
              <Events/>
            </section> */}
          </>
        } />
        
        {/* Ministry Pages */}
        <Route path="/ministries/youth" element={<Youth />} />
        <Route path="/ministries/women" element={<Women />} />
        <Route path="/ministries/men" element={<Men />} />
        <Route path="/ministries/kids" element={<Kids />} />
        <Route path="/strategies/evangelizing" element={<Evangelizing />} />
          <Route path="/strategies/establishing" element={<Establishing />} />
          <Route path="/strategies/edifying" element={<Edifying />} />
          <Route path="/strategies/equipping" element={<Equipping />} />
          <Route path="/strategies/compassion" element={<Compassion />} />

        {/* Standalone Pages */}
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Fallback to home for any unmatched routes */}
        <Route path="*" element={
          <section id="home" className="scroll-mt-20">
            <HeroSection/>
          </section>
        } />
      </Routes>
    </div>
  );
}

export default App;