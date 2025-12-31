import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx'; // Corrected path
import Footer from './components/Footer.jsx'; // Corrected path
import Home from './pages/Home.jsx'; // Corrected path
import Services from './pages/Services.jsx'; // Corrected path
import About from './pages/About.jsx'; // Corrected path
import Contact from './pages/Contact.jsx'; // Corrected path
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"; // Corrected path
import TermsOfService from "./pages/TermsOfService.jsx"; // Corrected path
import Sitemap from "./pages/Sitemap.jsx"; // Corrected path
//import ChatWidget from './components/ChatWidget.jsx'; // <-- 1. IMPORT THE WIDGET (Corrected path)
import GeminiChatWidget from './components/GeminiChatWidget.jsx';


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
      
      {/* 2. INCLUDE THE WIDGET HERE 
      <ChatWidget /> */}
      <GeminiChatWidget />
      
    </div>
  );
}

export default App;