import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | CareerConnect</title>
        <meta name="description" content="Learn about CareerConnect and our mission to connect talent with opportunity." />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CareerConnect</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting talent with opportunity through innovative technology and personalized service.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 ">
            <div className=''>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Founded in 2023</h3>
              <p className="text-gray-600 mb-4">
                CareerConnect was born out of a simple idea: to make job searching and hiring more human, more efficient, 
                and more effective for everyone involved.
              </p>
              <p className="text-gray-600 mb-4">
                Our founders, a team of HR professionals and technologists, saw the challenges both job seekers and 
                employers faced in the traditional hiring process and set out to build a better solution.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve thousands of companies and candidates across multiple industries, helping 
                them find the perfect match.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="/Our Team Photo.jpg"
                  alt="Our Team"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-4xl text-blue-600 mb-4">🌐</div>
                <h3 className="text-xl font-semibold mb-3">Connect</h3>
                <p className="text-gray-600">
                  Bridge the gap between talented professionals and innovative companies looking for their skills.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-4xl text-blue-600 mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-3">Simplify</h3>
                <p className="text-gray-600">
                  Make the job search and hiring process straightforward, transparent, and stress-free.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-4xl text-blue-600 mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Empower</h3>
                <p className="text-gray-600">
                  Provide tools and resources to help both candidates and employers make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                bio: "HR technology expert with 15+ years in the industry.",
                avatar: "👨‍💼"
              },
              {
                name: "Maria Garcia",
                role: "CTO",
                bio: "Software engineer passionate about building impactful products.",
                avatar: "👩‍💻"
              },
              {
                name: "James Wilson",
                role: "Head of Product",
                bio: "Product leader focused on user-centered design.",
                avatar: "🧑‍🎨"
              },
              {
                name: "Sarah Chen",
                role: "Head of Talent",
                bio: "Recruitment specialist connecting people with great opportunities.",
                avatar: "👩‍💼"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join us?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you're looking for your next opportunity or your next great hire, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up Now
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}