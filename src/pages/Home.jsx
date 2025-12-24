import React from 'react';
import { ArrowRight, Monitor, Globe, Video, Server, CheckCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = ({ onSelectServiceCategory }) => {

  if (!onSelectServiceCategory) {
    onSelectServiceCategory = () => { };
  }
  const services = [
    {
      icon: Monitor,
      title: 'Website Development',
      description:
        'Custom websites and web apps crafted to perform, engage, and convert visitors into clients.',
      link: '/services/web-development',
      tagline: 'Your online presence, perfectly built.',
    },
    {
      icon: Globe,
      title: 'Google Services',
      description:
        'Boost visibility and credibility with Google My Business, Virtual Tours, Ads & Workspace setup.',
      link: '/services/google-services',
      tagline: 'Be discoverable, trusted, and data-driven.',
    },
    {
      icon: Server,
      title: 'IT Infrastructure',
      description:
        'Robust servers, networks, CCTV & support to keep your systems running 24 × 7.',
      link: '/services/it-infrastructure',
      tagline: 'Your business backbone, secured and optimized.',
    },
    {
      icon: Video,
      title: 'Digital Media',
      description:
        'Professional video editing, YouTube & social-media management for stronger engagement.',
      link: '/services/digital-media',
      tagline: 'Turn your brand stories into viral moments.',
    },
  ];

  const stats = [
    { number: '1200+', label: 'Projects Completed' },
    { number: '1800+', label: 'Happy Clients' },
    { number: '25 + Years', label: 'Experience' },
    { number: '11 - 7 PM', label: 'Support Available' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'Tools Solutions',
      content:
        'Digital IMALAG transformed our online presence. Their Google My Business management boosted visibility by 300 %.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      company: 'Creative Studios',
      content:
        'Outstanding video-editing services! Our engagement doubled within weeks.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      company: 'Enterprise Corp',
      content:
        'Reliable IT support & setup. The team is highly professional and quick to respond.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-0">
      {/* HERO SECTION WITH FULL BACKGROUND IMAGE + CENTER VIDEO */}
      <section
        className="relative flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('/images/HomeBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        {/* Soft overlay for text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Video inside the dark center area */}
        <div className="relative z-20 w-full max-w-2xl px-4 mt-5 translate-y-[30px]">
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/10.mp4"
            ></video>
          </div>
        </div>

        {/* Text content below video */}
        <div className="relative z-10 text-center px-4 mt-10">
          <h1 className="text-2xl md:text-5xl lg:text-5xl font-extrabold leading-tight mb-2">
            Empowering Businesses
            <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              {' '}with Digital Innovation
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-2xl text-blue-100 max-w-4xl mx-auto mb-5 leading-relaxed">
            Digital IMALAG provides world-class IT and digital solutions — from websites
            to infrastructure and marketing — for growth-ready businesses.
          </p>

          {/*<div className="flex flex-col sm:flex-row gap-5 justify-center">
      <a
        href="/services"
        className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
      >
        <span>Explore Services</span>
        <ArrowRight className="w-5 h-5" />
      </a>
      <a
        href="/contact"
        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
      >
        Get in Touch
      </a>
    </div> */}
        </div>
      </section>



      {/* ---------- SERVICES HIGHLIGHT ---------- */}
      <section className="py-20 bg-gray-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Services
            </h2>
            <p className="text-lg md:text-xl text-white leading-relaxed w-full">
              We provide innovative digital and IT solutions designed to accelerate your brand's growth, improve operational efficiency, and expand your customer reach.
              Our website and web application development services focus on creating modern, responsive, and performance-driven digital experiences.
              Through our Google services, we help businesses enhance visibility, credibility, and engagement across key Google platforms.
              Our IT services ensure reliable infrastructure, seamless operations, and secure technical support tailored to your business needs.
              With our digital media solutions, we strengthen your online presence through creative content, branding, and audience-focused strategies.
              At Digital IMALAG, every service is crafted to deliver measurable results and long-term value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;

              // Map each title to the correct service category
              const title = service.title.toLowerCase();

              let categoryKey = 'website';
              if (title.includes('website')) categoryKey = 'website';
              else if (title.includes('google')) categoryKey = 'google';
              else if (title.includes('it') || title.includes('infrastructure')) categoryKey = 'it';
              else if (title.includes('digital') || title.includes('media')) categoryKey = 'digital'; // ✅ Updated


              return (
                <motion.div
                  key={index}
                  onClick={() => onSelectServiceCategory(categoryKey)} // 👈 handle click instead of href
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 flex flex-col items-center text-center transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-800 to-white-200 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{service.tagline}</p>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="py-6 bg-gray-600 text-white">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-white-200 mb-2">{s.number}</div>
              <div className="text-white-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="py-20 bg-gray-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white">
              Trusted by businesses across India and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">“{t.content}”</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-10 bg-gray-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Let's discuss how Digital IMALAG can help accelerate your business growth
            with modern, results-driven IT and digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Your Project
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
