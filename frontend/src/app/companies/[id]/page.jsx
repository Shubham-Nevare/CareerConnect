"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CompanyProfilePage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendUrl}/admin/companies`);
        if (!res.ok) throw new Error("Failed to fetch company");
        const companies = await res.json();
        const found = companies.find((c) => c._id === id);
        if (!found) throw new Error("Company not found");
        setCompany(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border-l-4 border-red-500 rounded">
        <h2 className="text-lg font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <Link href="/companies" className="text-blue-600 underline mt-4 inline-block">Back to Companies</Link>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 pb-6 pt-14">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors cursor-pointer"
      >
        <span className="mr-2">←</span> Back
      </button>
      <div className="flex items-center mb-6">
        <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mr-6">
          {company.logo ? (
            <img
              src={company.logo.startsWith("http") ? company.logo : `${backendUrl}${company.logo}`}
              alt={company.name}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.src = "/default-company.jpg"; }}
            />
          ) : (
            <span className="text-3xl font-bold text-gray-400">{company.name[0]}</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
          <div className="text-gray-500 mt-1">{company.industry}</div>
          <div className="text-sm text-gray-400 mt-1">Joined: {new Date(company.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="justify-end ml-auto align-start">
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${company.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{company.status}</span>
      </div>
      </div>
      {/* <div className="mb-4">
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${company.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{company.status}</span>
      </div> */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
        <p className="text-gray-700 whitespace-pre-line">{company.description || "No description provided."}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-gray-500">Website:</div>
          <div className="text-blue-600">
            {company.website ? (
              <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Location:</div>
          <div>{company.location || <span className="text-gray-400">N/A</span>}</div>
        </div>
        <div>
          <div className="text-gray-500">Employees:</div>
          <div>{company.employees || <span className="text-gray-400">N/A</span>}</div>
        </div>
        <div>
          <div className="text-gray-500">Industry:</div>
          <div>{company.industry || <span className="text-gray-400">N/A</span>}</div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Jobs Posted</h2>
        {company.jobs && company.jobs.filter((job) => job.status === "active").length > 0 ? (
          <ul className="list-disc pl-6">
            {company.jobs.filter((job) => job.status === "active").map((job) => (
              <li key={job._id} className="mb-1">
                <Link href={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                  {job.title}
                </Link>
                <span className="ml-2 text-xs text-gray-500">({job.status})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No active jobs posted.</div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Recruiters</h2>
        {company.recruiters && company.recruiters.length > 0 ? (
          <ul className="list-disc pl-6">
            {company.recruiters.map((recruiter) => (
              <li key={recruiter._id || recruiter} className="mb-1">
                {recruiter.name && <span className="font-medium text-gray-800">{recruiter.name}</span>}
                {recruiter.email && (
                  <span className="ml-2 text-gray-500">{recruiter.email}</span>
                )}
                {!recruiter.name && !recruiter.email && (recruiter._id || recruiter)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No recruiters listed.</div>
        )}
      </div>
      <Link href="/companies" className="text-blue-600 underline">Back to Companies</Link>
    </div>
  );
};

export default CompanyProfilePage;
