import React from 'react';
import { ArrowRight } from 'lucide-react';

const WebDevelopment = () => {
  const examples = [
    '/images/web1.jpg',
    '/images/web2.jpg',
    '/images/web3.jpg',
    '/images/web4.jpg',
    '/images/web5.jpg',
  ];

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <img
          src="/images/web-hero.jpg"
          alt="Website Development"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Website Development</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            We create high-performance websites that engage visitors and drive measurable business growth.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">End-to-End Web Solutions</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          From portfolio sites to full e-commerce platforms, we deliver custom, responsive,
          SEO-friendly websites using the latest technologies and design trends.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {['Corporate Websites', 'E-commerce Stores', 'Landing Pages', 'Web Apps', 'Portfolio Sites'].map(
            (item, i) => (
              <span
                key={i}
                className="bg-white shadow-md px-6 py-3 rounded-full border border-gray-200 text-gray-800"
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      {/* Project Thumbnails */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Website Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {examples.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Website Example ${i + 1}`}
                className="rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Showcase */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">See How We Work</h2>
          <div className="aspect-video mx-auto max-w-4xl rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="public/images/5.mp4"
              title="Web Development Overview"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Let’s Build Your Dream Website
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Get in touch to discuss your project idea — our expert team is ready to turn it into reality.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          Start a Project <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </section>
    </div>
  );
};

export default WebDevelopment;
