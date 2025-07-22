// components/CompanyOverviewCard.jsx
import { FiBriefcase, FiGlobe, FiMapPin, FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
import { LuIndianRupee } from "react-icons/lu";

export default function CompanyOverviewCard({ job }) {
  const company = job?.company;

  if (!company) return null;

  const logoUrl = company.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}${company.logo}`
    : null;


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
      {/* Company Info */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">
          About {company.name || "the Company"}
        </h2>

        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden mr-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FiBriefcase className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{company.name || "Company Name"}</h3>
            <p className="text-sm text-gray-600">
              {company.industry || "Industry not specified"}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {company.website && (
            <div className="flex items-center">
              <FiGlobe className="text-gray-500 mr-2" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {company.location && (
            <div className="flex items-center">
              <FiMapPin className="text-gray-500 mr-2" />
              <span>{company.location}</span>
            </div>
          )}
          {company.employees && (
            <div className="flex items-center">
              <FiUsers className="text-gray-500 mr-2" />
              <span>{company.employees} employees</span>
            </div>
          )}
        </div>
      </div>

      {/* Job Insights */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Job Insights</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Posted</h3>
            <p className="flex items-center">
              <FiCalendar className="text-gray-500 mr-2" />
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Job Type</h3>
            <p className="capitalize">{job.type || "Not specified"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Experience Level
            </h3>
            <p className="capitalize">{job.experience || "Not specified"}</p>
          </div>

          {job.salary && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Salary</h3>
              <p className="flex items-center">
                <LuIndianRupee className="text-gray-500 mr-2" />
                {job.salary / 100000} LPA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
