'use client'; 

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Head from 'next/head';
import Link from 'next/link';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  // Refs for animation targets
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const jobsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
//   const ctaRef = useRef(null);

  // Animation setup
  useEffect(() => {
    // Hero section animations
    gsap.from(heroRef.current.querySelectorAll('.hero-content > *'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.3
    });

    // Search bar animation
    gsap.from(searchRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: 1
    });



    // Stats counter animation
    const counters = statsRef.current.querySelectorAll('.count');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2;
      const step = target / (duration * 60);

      let current = 0;
      const updateCounter = () => {
        if (current < target) {
          current += step;
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: updateCounter,
        once: true
      });
    });

  
  }, []);

  return (
    <>
     {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-cover"></div>
        </div>
        
        <div ref={heroRef} className="max-w-6xl mx-auto relative z-10">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your <span className="text-yellow-300">Dream Job</span> Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Join thousands of companies and candidates connecting through our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/jobs" 
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Jobs
              </Link>
              <Link 
                href="/employers" 
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Post a Job
              </Link>
            </div>
          </div>
          
          <div ref={searchRef} className="relative max-w-2xl mx-auto bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-1 shadow-xl">
            <div className="flex flex-col md:flex-row">
              <input 
                type="text" 
                className="flex-grow px-5 py-4 rounded-lg bg-white bg-opacity-20 placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white"
                placeholder="Job title, keywords, or company" 
              />
              <select className="md:w-40 px-4 py-2 md:py-0 bg-white bg-opacity-20 text-black border-l-0 md:border-l border-white border-opacity-30 focus:outline-none">
                <option value="" className="text-gray-900">All Locations</option>
                <option value="remote" className="text-gray-900">Remote</option>
                <option value="us" className="text-gray-900">United States</option>
                <option value="uk" className="text-gray-900">United Kingdom</option>
              </select>
              <button className="px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-300 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-6">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Netflix', 'Tesla'].map((company, i) => (
              <div key={i} className="text-2xl font-bold text-gray-700">{company}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <section ref={categoriesRef} className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Popular Job Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse jobs by your preferred category. We have opportunities across all industries.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Technology', icon: '💻', jobs: 1243 },
              { name: 'Healthcare', icon: '🏥', jobs: 892 },
              { name: 'Finance', icon: '💰', jobs: 756 },
              { name: 'Education', icon: '📚', jobs: 543 },
              { name: 'Marketing', icon: '📢', jobs: 678 },
              { name: 'Design', icon: '🎨', jobs: 432 },
              { name: 'Engineering', icon: '⚙️', jobs: 987 },
              { name: 'Remote', icon: '🌎', jobs: 1567 },
              { name: 'Sales', icon: '📈', jobs: 765 },
              { name: 'Customer Service', icon: '👥', jobs: 321 }
            ].map((category, i) => (
              <Link 
                key={i}
                href={`/jobs?category=${category.name.toLowerCase()}`}
                className="category-card group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:translate-y-[-4px]"
              >
                <div className="text-3xl mb-3 group-hover:text-blue-600 transition">{category.icon}</div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.jobs.toLocaleString()} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section ref={jobsRef} className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold">Featured Jobs</h2>
              <p className="text-gray-600">Hand-picked opportunities from top companies</p>
            </div>
            <Link href="/jobs" className="flex items-center text-blue-600 font-medium hover:underline">
              View all jobs <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                id: 1,
                title: 'Senior Frontend Developer (React)', 
                company: 'TechCorp', 
                location: 'San Francisco, CA (Remote)', 
                type: 'Full-time', 
                salary: '$120,000 - $150,000', 
                logo: '/techcorp-logo.png',
                posted: '2 days ago',
                skills: ['React', 'TypeScript', 'Next.js']
              },
              { 
                id: 2,
                title: 'UX/UI Designer', 
                company: 'DesignHub', 
                location: 'New York, NY', 
                type: 'Contract', 
                salary: '$80 - $100/hr', 
                logo: '/designhub-logo.png',
                posted: '5 days ago',
                skills: ['Figma', 'Sketch', 'Adobe XD']
              },
              { 
                id: 3,
                title: 'Data Scientist', 
                company: 'AnalyticsPro', 
                location: 'Chicago, IL (Hybrid)', 
                type: 'Full-time', 
                salary: '$110,000 - $140,000', 
                logo: '/analyticspro-logo.png',
                posted: '1 day ago',
                skills: ['Python', 'Machine Learning', 'SQL']
              },
              { 
                id: 4,
                title: 'Product Manager', 
                company: 'InnovateCo', 
                location: 'Austin, TX', 
                type: 'Full-time', 
                salary: '$130,000 - $160,000', 
                logo: '/innovateco-logo.png',
                posted: '3 days ago',
                skills: ['Agile', 'Scrum', 'Product Strategy']
              }
            ].map((job) => (
              <div 
                key={job.id}
                className="job-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      {/* In a real app, you would use next/image */}
                      <div className="text-2xl">🏢</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg hover:text-blue-600 transition cursor-pointer">{job.title}</h3>
                      <p className="text-gray-700">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{job.type}</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{job.salary}</span>
                        {job.skills.map((skill, i) => (
                          <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end space-y-2">
                    <span className="text-sm text-gray-500">{job.posted}</span>
                    <Link 
                      href={`/jobs/${job.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-auto text-center"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="12500">0</div>
              <p className="text-blue-100">Jobs Posted</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="8500">0</div>
              <p className="text-blue-100">Companies Hiring</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="3200">0</div>
              <p className="text-blue-100">Candidates Hired</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="95">0</div>
              <p className="text-blue-100">% Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who found their dream jobs through our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Designer at TechCorp",
                quote: "I found my dream job within a week of using CareerConnect. The platform made it so easy to connect with top companies.",
                avatar: "👩"
              },
              {
                name: "Michael Chen",
                role: "Senior Developer at InnovateCo",
                quote: "The quality of job listings here is unmatched. I received multiple offers within days of creating my profile.",
                avatar: "👨"
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Director at BrandVision",
                quote: "As an employer, we've hired exceptional talent through CareerConnect. It's our go-to platform for recruitment.",
                avatar: "👩"
              }
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="testimonial bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section  className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take the next step in your career?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who found their dream jobs through our platform.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </Link>
            <Link 
              href="/jobs" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}