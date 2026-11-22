import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import Portal from '@/components/Portal';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

export default function App() {
  const route = useHashRoute();
  const isPortal = route === '#portal';

  if (isPortal) {
    return (
      <AuthProvider>
        <Portal />
      </AuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-white font-cairo" dir="rtl">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <About />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
