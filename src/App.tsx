import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('website'); // 👈 NEW
  

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
  switch (currentPage) {
    case 'services':
  return (
    <Services
      defaultCategory={selectedServiceCategory}
      setCurrentPage={setCurrentPage}
    />
  );
    case 'about':
      return <About />;
    case 'contact':
      return <Contact />;

      
    case "privacy":
      return <PrivacyPolicy />;
    case "terms":
      return <TermsOfService />;
    case "sitemap":
  return <Sitemap setCurrentPage={setCurrentPage} />;
    default:
      return (
        <Home
          onSelectServiceCategory={(category) => {
            setSelectedServiceCategory(category);
            setCurrentPage('services');
          }}
        />
        ); // 👈 Pass handler to Home
    }
  };

  const pageBackgroundStyle =
    currentPage === 'home'
      ? {}
      : { backgroundColor: '#f3f4f6', minHeight: '100vh' };

  return (
    <div style={pageBackgroundStyle}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
