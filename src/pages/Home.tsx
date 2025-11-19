import React from 'react';
import { ArrowRight, Monitor, Globe, Video, Server, Shield, Users, CheckCircle, Star } from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      icon: Monitor,
      title: 'Website Development',
      description: 'Custom websites and web applications built with modern technologies for optimal performance.',
    },
    {
      icon: Globe,
      title: 'Google Services',
      description: 'Google My Business management, virtual tours, and comprehensive Google workspace solutions.',
    },
    {
      icon: Server,
      title: 'IT Infrastructure',
      description: 'Complete IT solutions including servers, networking, CCTV, and system maintenance.',
    },
    {
      icon: Video,
      title: 'Digital Media',
      description: 'Video editing, social media content creation, and YouTube channel management services.',
    },
  ];

  const stats = [
    { number: '1200+', label: 'Projects Completed' },
    { number: '1800+', label: 'Happy Clients' },
    { number: '25+', label: 'Years Experience' },
    { number: '11 to 7 PM', label: 'Support Available' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'Tech Solutions Pvt Ltd',
      content: 'Digital IMALAG transformed our online presence completely. Their Google My Business management increased our visibility by 300%.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      company: 'Creative Studios',
      content: 'Outstanding video editing services! They helped us create engaging content that doubled our social media engagement.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      company: 'Enterprise Corp',
      content: 'Reliable IT support and infrastructure setup. Their team is professional and always available when we need assistance.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
<section className="relative text-white py-24 lg:py-40 overflow-hidden">
  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/videos/tech-bg-loop.mp4" type="video/mp4" />
  </video>

  {/* Overlay */}
  <div className="absolute inset-0 bg-blue-900 bg-opacity-70 backdrop-blur-sm"></div>

  {/* Animated Blobs */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse delay-700"></div>

  <div className="container relative z-10 mx-auto px-6 text-center max-w-5xl">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
      Transform Your Business with 
      <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
        {" "}Digital IMALAG
      </span>
    </h1>

    <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-10">
      End-to-end digital, web, and IT infrastructure solutions — crafted to help you grow, connect, and succeed in the modern world.
    </p>

    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
      <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
        <span>Explore Our Services</span>
        <ArrowRight className="w-5 h-5" />
      </button>
      <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105">
        Get a Free Consultation
      </button>
    </div>
  </div>
</section>


      {/* Services Highlight */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Our Core Services
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Comprehensive digital and IT solutions designed to accelerate your business growth and digital transformation.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => {
        const IconComponent = service.icon;

        // 👇 Map service title to category key
        const title = service.title.toLowerCase();
        let categoryKey = 'website';
        if (title.includes('website')) categoryKey = 'website';
        else if (title.includes('google')) categoryKey = 'google';
        else if (title.includes('it') || title.includes('infrastructure')) categoryKey = 'it';
        else if (title.includes('digital') || title.includes('media')) categoryKey = 'digital';

        return (
          <div
            key={index}
            onClick={() => {
              // 👇 Send the category key to App for redirect
              const event = new CustomEvent('navigateToService', { detail: categoryKey });
              window.dispatchEvent(event);
            }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <IconComponent className="text-white w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{service.title}</h3>
            <p className="text-gray-600 text-center leading-relaxed">{service.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Digital IMALAG?
              </h2>
              <p className="text-xl text-gray-600">
                We deliver exceptional results through innovation, expertise, and dedicated support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    title: 'Expert Team',
                    description: 'Skilled professionals with years of experience in digital transformation and IT solutions.',
                  },
                  {
                    title: 'Comprehensive Solutions',
                    description: 'End-to-end services covering all aspects of your digital and IT infrastructure needs.',
                  },
                  {
                    title: 'Best Support',
                    description: 'Best Technical support to ensure your systems, website, server, network, surveillance, and social media always run smoothly.',
                  },
                  {
                    title: 'Cost-Effective',
                    description: 'Competitive pricing with transparent billing and no hidden costs for all our services.',
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                  <img 
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg" 
                    alt="Professional team working on digital solutions" 
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by businesses across India and beyond.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let's discuss how Digital IMALAG can help accelerate your business growth with our comprehensive IT and digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Your Project
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;