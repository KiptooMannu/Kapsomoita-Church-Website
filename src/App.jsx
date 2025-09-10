import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import Give from "./Pages/Give";
import Serve from "./Pages/Serve";
import ServeForm from "./Pages/ServeForm";
import HeroSection from "./Components/HeroSection";
import About from "./Pages/About";
import Youth from "./Pages/ministries/Youth";
import Women from "./Pages/ministries/Women";
import Men from "./Pages/ministries/Men";
import Kids from "./Pages/ministries/Kids";
import Sermons from "./Pages/Sermons";
import Gallery from "./Pages/Gallery";
import Contact from "./Pages/Contacts";

import Evangelizing from "./Pages/strategies/Evangelizing";
import Establishing from "./Pages/strategies/Establishing";
import Edifying from "./Pages/strategies/Edifying";
import Equipping from "./Pages/strategies/Equipping";
import Compassion from "./Pages/strategies/Compassion";

function App() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        {/* ✅ Force re-render when route changes */}
        <Routes location={location} key={location.pathname}>
          {/* Homepage */}
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

                {/* Serve section */}
                <section id="serve" className="scroll-mt-20">
                  <Serve />
                </section>

                <section id="contact" className="scroll-mt-20">
                  <Contact asHomeSection={true} />
                </section>
              </>
            }
          />

          {/* ✅ Serve Form page */}
          <Route path="/serve" element={<ServeForm />} />

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
          <Route path="/give" element={<Give />} />

          {/* Fallback → homepage */}
          <Route
            path="*"
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

                <section id="serve" className="scroll-mt-20">
                  <Serve />
                </section>

                <section id="contact" className="scroll-mt-20">
                  <Contact asHomeSection={true} />
                </section>
              </>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
