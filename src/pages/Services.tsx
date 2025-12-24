import React, { useState } from 'react';
import QuoteModal from '../components/QuoteModal';
import {
  Monitor,
  Server,
  Wifi,
  Shield,
  Camera,
  HelpCircle,
  Globe,
  MapPin,
  Mail,
  Video,
  Edit,
  Youtube,
  ChevronRight,
  ArrowRight
} from 'lucide-react';


interface ServicesProps {
  defaultCategory?: string;
  setCurrentPage?: (page: string) => void;   // ← ADD THIS
}


const Services: React.FC<ServicesProps> = ({ defaultCategory = 'website', setCurrentPage }) => {

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // ✅ STEP 1: Add project list here
  const websiteProjects = [
    { img: "/images/w4.png", link: "https://ftt.imalag.com/products/laptops" },
    { img: "/images/w1.png", link: "https://www.reikitirth.in/" },
    { img: "/images/w3.png", link: "https://www.imalag.com/" },
    { img: "/images/w6.png", link: "https://inventory.imalag.com/" },
    { img: "/images/w2.png", link: "https://www.reikiwellness.in/" },
    { img: "/images/w5.png", link: "https://multitools.imalag.com/" },
    
    
  ];

  const serviceCategories = {
    website: {
  title: 'Website Development',
  
  description:
    'Professional website design and development services to build your digital identity and grow your business online.',
  icon: Globe, // You can use a better icon if available, like Code or Monitor
  
  services: [
    {
      icon: Globe,
      title: 'Business Websites',
      description:
        'Custom-designed responsive websites that represent your brand, attract visitors, and convert leads into customers.',
          color: '#0ba5b0ff',
        features: [
        'Corporate & Portfolio Sites',
        'Mobile-First Responsive Design',
        'SEO-Optimized Pages',
        'Fast and Secure Hosting Setup',
      ],
    },
    {
      icon: Globe,
      title: 'E-Commerce Websites',
      description:
        'Complete online store solutions that help you sell products and manage orders with ease.',
        color: '#0ba5b0ff',
      features: [
        'Product Catalog & Cart System',
        'Payment Gateway Integration',
        'Inventory & Order Management',
        'User-Friendly Admin Dashboard',
      ],
    },
    {
      icon: Globe,
      title: 'Portfolio & Creative Websites',
      description:
        'Stylish and engaging portfolio sites for artists, designers, and creators to showcase their best work.',
        color: '#0ba5b0ff',
      features: [
        'Dynamic Gallery Layouts',
        'Media-Ready Design',
        'Social Media Integration',
        'Custom Branding Options',
      ],
    },
    {
      icon: Globe,
      title: 'Landing Pages & One-Page Sites',
      description:
        'High-converting landing pages designed for marketing campaigns and product promotions.',
        color: '#0ba5b0ff',
      features: [
        'Conversion-Focused Layouts',
        'Call-to-Action Optimization',
        'Lead Form Integration',
        'Analytics & Tracking Setup',
      ],
    },
    {
      icon: Globe,
      title: 'Website Maintenance & Support',
      description:
        'Keep your site running smoothly with ongoing updates, backups, and performance optimization.',
        color: '#0ba5b0ff',
      features: [
        'Regular Content Updates',
        'Security Monitoring',
        'Backup & Restore Solutions',
        'Speed Optimization',
      ],
    },
  ],
},

    google: {
      title: 'Google Services',
      description: 'Comprehensive Google platform management and optimization',
      icon: Globe,
      services: [
        {
          icon: Globe,
          title: 'Google My Business - Management',
          description: 'Complete GMB optimization to improve local visibility and customer engagement.',
          features: ['Profile Optimization', 'Review Management', 'Post Scheduling', 'Analytics Reporting'],
        },
        {
          icon: MapPin,
          title: 'Google Virtual Tours',
          description: 'Immersive 360° virtual tours to showcase your business location and attract more customers.',
          features: ['360° Photography', 'Tour Creation', 'Google Integration', 'Enhanced Listings'],
        },
        {
          icon: Globe,
          title: 'Google Ads Setup & Optimization',
          description: 'Professional Google Ads campaigns to drive targeted traffic and maximize ROI.',
          features: ['Campaign Setup', 'Keyword Research', 'Ad Optimization', 'Performance Tracking'],
        },
        {
          icon: Mail,
          title: 'Email Service Setup',
          description: 'Professional email solutions using Google Workspace and other platforms.',
          features: ['Domain Email Setup', 'Security Configuration', 'Mobile Integration', 'Storage Management'],
        },
        {
          icon: Mail,
          title: 'Email Backup & Migration',
          description: 'Secure email migration and backup services to protect your important communications.',
          features: ['Data Migration', 'Secure Backup', 'Account Transfer', 'Data Recovery'],
        },
      ],
    },
    it: {
      title: 'IT Services',
      description: 'Complete IT infrastructure solutions for businesses of all sizes',
      icon: Server,
      services: [
        {
          icon: Monitor,
          title: 'Laptop Repair & Maintenance',
          description: 'Professional laptop repair, hardware upgrades, software installation, and preventive maintenance services.',
          features: ['Hardware Diagnosis', 'Software Troubleshooting', 'Data Recovery', 'Performance Optimization'],
        },
        {
          icon: Server,
          title: 'Desktop Solutions',
          description: 'Custom desktop builds, repairs, and comprehensive maintenance for optimal performance.',
          features: ['Custom PC Building', 'Component Upgrades', 'System Optimization', 'Regular Maintenance'],
        },
        {
          icon: Wifi,
          title: 'Server Setup & Support',
          description: 'Professional server installation, configuration, and ongoing support for business continuity.',
          features: ['Server Installation', 'Configuration Management', '24/7 Monitoring', 'Backup Solutions'],
        },
        {
          icon: Wifi,
          title: 'Networking Installation',
          description: 'Complete networking solutions including LAN, WAN setup, and network security implementation.',
          features: ['Network Design', 'Cable Installation', 'Router Configuration', 'Security Setup'],
        },
        {
          icon: Camera,
          title: 'CCTV Installation & Monitoring',
          description: 'Advanced surveillance systems with HD cameras, remote monitoring, and cloud storage solutions.',
          features: ['HD Camera Installation', 'Remote Monitoring', 'Cloud Storage', 'Mobile App Access'],
        },
        {
          icon: HelpCircle,
          title: 'IT Counselling & Consultancy',
          description: 'Expert IT consulting to help businesses make informed technology decisions and optimize their IT infrastructure.',
          features: ['Technology Assessment', 'Strategic Planning', 'Budget Optimization', 'Implementation Guidance'],
        },
      ],
    },
    
      digital: {
          title: 'Digital Media',
          description: 'Creative content and digital media management solutions',
          icon: Video,
          services: [
        {
          icon: Edit,
          title: 'Video Editing for Businesses',
          description: 'Professional video editing services for marketing, training, and promotional content.',
          features: ['Professional Editing', 'Color Correction', 'Audio Enhancement', 'Motion Graphics'],
        },
        {
          icon: Video,
          title: 'Digital Media Video Creation',
          description: 'Engaging video content designed for digital media platforms.',
          features: ['Platform Optimization', 'Engaging Content', 'Brand Consistency', 'Viral Potential'],
        },
        {
          icon: Youtube,
          title: 'YouTube Channel Management',
          description: 'Complete YouTube channel setup, optimization, and ongoing management for growth.',
          features: ['Channel Setup', 'SEO Optimization', 'Thumbnail Design', 'Analytics Tracking'],
        },
        {
          icon: Video,
          title: 'YouTube Video Creation & Optimization',
          description: 'End-to-end video production and optimization services for maximum YouTube visibility.',
          features: ['Video Production', 'SEO Optimization', 'Audience Engagement', 'Growth Strategies'],
        },
      ],
    },
  };

  const currentCategory = serviceCategories[selectedCategory as keyof typeof serviceCategories];

  return (
    <div className="py-16 bg-white-500 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Our Services
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Comprehensive digital and IT solutions tailored to meet your business needs. From infrastructure to digital marketing, we've got you covered.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-col sm:flex-row justify-center mb-12 space-y-4 sm:space-y-0 sm:space-x-4">
          {Object.entries(serviceCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === key
                    ? 'bg-black text-white shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-gray-200 shadow-lg'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span>{category.title}</span>
              </button>
            );
          })}
        <QuoteModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  serviceName={selectedService}
  onSubmit={(data) => {
    console.log('Form submitted:', data, 'Service:', selectedService);
    alert('Thank you! We’ll contact you soon.');
  }}
  />
    </div>
 {/*Showcase Section */}
{selectedCategory === 'website' && (
  <div id="portfolioSection" className="mb-20 text-center">

    <h2 className="text-3xl font-bold text-black mb-8">Our Recent Website Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
  {websiteProjects.map((project, i) => (
    <a
      key={i}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={project.img}
        alt={`Website Project ${i + 1}`}
        className="rounded-xl shadow-md hover:scale-105 transition-all duration-300 w-full object-cover"
      />
    </a>
  ))}
</div>
    <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
      {/*<iframe
        width="100%"
        height="400"
        src="/11.mp4"
        title="Website Showcase"
        allowFullScreen
      ></iframe>*/}
    </div>
  </div>
)} 

{selectedCategory === 'google' && (
  <div className="mb-20 text-center">
    <h2 className="text-3xl font-bold mb-8">Google Virtual Tour Examples</h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {['/images/vt1.png', '/images/vt5.mp4', '/images/vt2.png', '/images/vt4.png', '/images/vt3.png'].map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Google Virtual Tour ${i + 1}`}
          className="rounded-xl shadow-md hover:scale-105 transition-all duration-300"
        />
      ))}
    </div>
    {/*<iframe
      className="w-full max-w-4xl mx-auto h-96 rounded-xl shadow-lg"
      src="https://www.youtube.com/embed/VbfpW0pbvaU"
      title="Google Service Demo"
      allowFullScreen
    ></iframe>*/}
  </div>
)}
{selectedCategory === 'digital' && (
  <div className="mb-20 text-center">
    {/* <h2 className="text-3xl font-bold mb-8">Our YouTube & Social Media Work</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {['/images/yt1.jpg', '/images/yt2.jpg', '/images/yt3.jpg', '/images/yt4.jpg'].map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Social Video ${i + 1}`}
          className="rounded-xl shadow-md hover:scale-105 transition-all duration-300"
        />
      ))}
    </div> */}

    {/*<iframe
      className="w-full max-w-4xl mx-auto h-96 rounded-xl shadow-lg"
      src="https://www.youtube.com/embed/9bZkp7q19f0"
      title="Digital Media Highlights"
      allowFullScreen
    ></iframe>*/}
  </div>
)}
        {/* Category Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-50 h-50 bg-gradient-to-r from-white-600 to-blue-700 rounded-2xl mb-6">
            
            {React.createElement(currentCategory.icon, { className: "w-10 h-10 text-black" })}

          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentCategory.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {currentCategory.services.map((service, index) => {
  const IconComponent = service.icon;

  return (
    <div
      key={index}
      className="service-item relative"
      style={{ "--color": service.color ?? "#0ba5b0ff" } as React.CSSProperties}
    >
      <div className="service-layer">

        {/* Icon + Title */}
        <div className="flex items-center mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 text-white"
            style={{ backgroundColor: service.color ?? "#684022ff" }}
          >
            <IconComponent className="w-7 h-7" />
          </div>

          <h3
            className="text-xl font-bold"
            style={{ color: service.color ?? "#633d1fff" }}
          >
            {service.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-black mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {service.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: service.color ?? "#684022ff" }}
              ></div>
              <span className="text-gray-800">{feature}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => {
              setSelectedService(service.title);
              setIsModalOpen(true);
            }}
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-black transition-all"
          >
            Get Quote
          </button>

          <button className="px-6 py-2 border border-gray-600 text-white-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
            Learn More
          </button>
        </div>

      </div>

      {/* Step Number 
      <h4 className="text-white text-center py-3 font-semibold text-lg">
        Step {index + 1 < 10 ? `0${index + 1}` : index + 1}
      </h4>*/}
    </div>
  );
})}
    </div>

        {/* Call to Action */}
        <div className="bg-white-600 text-black rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-xl text-blakc-100 mb-8 max-w-2xl mx-auto">
            Don't see exactly what you're looking for? We create custom solutions tailored to your specific business requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

  {/* 👉 Redirect to Contact Page */}
  <button
    onClick={() => setCurrentPage && setCurrentPage('contact')}
    className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
  >
    Discuss Your Needs
  </button>

  {/* 👉 Scroll to Website Projects Section */}
  <button
    onClick={() => {
      const section = document.getElementById("portfolioSection");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }}
    className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
  >
    View Portfolio
  </button>

</div>

        </div>
      </div>
    </div>
  );
};

export default Services;