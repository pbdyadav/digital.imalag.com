import React from 'react';
import { Award, Users, Target, Clock, Lightbulb, Shield, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We stay ahead of technology trends to provide cutting-edge solutions that give our clients a competitive advantage.',
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Our clients trust us to deliver consistent, high-quality services with 99.9% uptime and responsive support.',
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'Every solution is tailored to meet our clients\' unique needs, ensuring maximum value and satisfaction.',
    },
    {
      icon: Zap,
      title: 'Excellence',
      description: 'We maintain the highest standards in all our services, from initial consultation to ongoing support.',
    },
  ];

  const stats = [
    { icon: Users, number: '200+', label: 'Satisfied Clients' },
    { icon: Award, number: '500+', label: 'Projects Completed' },
    { icon: Target, number: '99.9%', label: 'Uptime Guarantee' },
    { icon: Clock, number: '5+', label: 'Years Experience' },
  ];

  const team = [
    {
      name: 'Rahul Sharma',
      role: 'Technical Director',
      expertise: 'IT Infrastructure & System Architecture',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    },
    {
      name: 'Priya Patel',
      role: 'Digital Marketing Lead',
      expertise: 'Google Services & Social Media Strategy',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    },
    {
      name: 'Amit Kumar',
      role: 'Web Development Manager',
      expertise: 'Full-Stack Development & UI/UX',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg',
    },
  ];

  return (
    <div className="py-16 bg-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            About Digital IMALAG
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Part of the trusted IMALAG brand, we are your dedicated partner for comprehensive digital transformation and IT solutions across India and beyond.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Our Mission
              </h2>
              <p className="text-lg text-black leading-relaxed">
                <span className="font-semibold text-black">"Empowering businesses with innovative digital and IT solutions across India and beyond."</span>
              </p>
              <p className="text-black leading-relaxed">
                At Digital IMALAG, we believe that technology should be an enabler, not a barrier. Our mission is to democratize access to professional-grade digital and IT services, helping businesses of all sizes achieve their full potential through smart technology solutions.
              </p>
              <p className="text-black leading-relaxed">
                We combine years of technical expertise with a deep understanding of business needs to deliver solutions that are not just technically sound, but also commercially viable and strategically aligned with our clients' goals.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg" 
                  alt="Team working on digital solutions" 
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-black mb-2">{stat.number}</div>
                  <div className="font-bold text-black">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Values
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              These core principles guide every decision we make and every solution we deliver.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{value.title}</h3>
                  <p className="text-black leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Experienced professionals dedicated to delivering exceptional results for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="aspect-w-4 aspect-h-3">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-semibold mb-3">{member.role}</div>
                  <p className="text-gray-600">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Businesses Trust Digital IMALAG
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">11:00am - 7:00pm</div>
              <div className="font-semibold mb-2">Support Available</div>
              <div className="text-blue-100 text-sm">{/*Round-the-clock technical assistance*/}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">100%</div>
              <div className="font-semibold mb-2">Client Satisfaction</div>
              <div className="text-blue-100 text-sm">Commitment to excellence in service</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">Pan-India</div>
              <div className="font-semibold mb-2">Service Coverage</div>
              <div className="text-blue-100 text-sm">Nationwide support and solutions</div>
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Your Journey With Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;