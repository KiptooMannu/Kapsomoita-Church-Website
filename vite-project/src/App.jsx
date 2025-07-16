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
import Contact from './Pages/Contacts';
import Evangelizing from "./Pages/strategies/Evangelizing";
import Establishing from "./Pages/strategies/Establishing";
import Edifying from "./Pages/strategies/Edifying";
import Equipping from "./Pages/strategies/Equipping";
import Compassion from "./Pages/strategies/Compassion";
import Footer from './Components/Footer'; // ✅ Import the Footer

function App() {
  const location = useLocation();

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section id="home" className="scroll-mt-20">
                  <HeroSection />
                </section>

                <section id="about" className="scroll-mt-20">
                  <About />
                </section>

                <section id="sermons" className="scroll-mt-20">
                  <Sermons />
                </section>

                <section id="gallery" className="scroll-mt-20">
                  <Gallery asHomeSection={true} />
                </section>

                <section id="contact" className="scroll-mt-20">
                  <Contact asHomeSection={true} />
                </section>

                {/* Uncomment and implement when ready */}
                {/* <section id="ministries" className="scroll-mt-20">
                  <Ministries />
                </section>

                <section id="events" className="scroll-mt-20">
                  <Events />
                </section> */}
              </>
            }
          />

          {/* Ministry Pages */}
          <Route path="/ministries/youth" element={<Youth />} />
          <Route path="/ministries/women" element={<Women />} />
          <Route path="/ministries/men" element={<Men />} />
          <Route path="/ministries/kids" element={<Kids />} />

          {/* Strategy Pages */}
          <Route path="/strategies/evangelizing" element={<Evangelizing />} />
          <Route path="/strategies/establishing" element={<Establishing />} />
          <Route path="/strategies/edifying" element={<Edifying />} />
          <Route path="/strategies/equipping" element={<Equipping />} />
          <Route path="/strategies/compassion" element={<Compassion />} />

          {/* Standalone Pages */}
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback to home */}
          <Route
            path="*"
            element={
              <section id="home" className="scroll-mt-20">
                <HeroSection />
              </section>
            }
          />
        </Routes>
      </main>

  
      <Footer />
    </div>
  );
}

export default App;
