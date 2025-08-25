"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useMemo } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiInfo,
  FiList,
  FiMapPin,
} from "react-icons/fi";
import CompanyOverviewCard from "./components/CompanyOverviewCard";
import { FaRupeeSign } from "react-icons/fa";
import { RiCurrencyRupeeLine } from "react-icons/ri"; // Alternative thinner icon


export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
    coverLetter: "",
  });
  const [similarJobs, setSimilarJobs] = useState([]);
  const [userApplication, setUserApplication] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    // Reset states first
    setUserApplication(null);
    setJob(null); // optional: clear job if needed
    setLoading(true);

    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`
        );
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/latest/${id}`
        );
        if (res.ok) {
          const data = await res.json();
          setSimilarJobs(data);
        }
      } catch (err) {
        console.error("Error fetching similar jobs", err);
      }
    };

    const fetchUserApplication = async () => {
      if (!user || !id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications?userId=${
            user._id || user.id
          }&jobId=${id}`
        );
        if (res.ok) {
          const data = await res.json();
          // Make sure it's actually for THIS job
          // const matched = Array.isArray(data)
          //   ? data.find((app) => app.jobId === id || app.jobId?._id === id)
          //   : null;
          // setUserApplication(matched || null);
          const matched = Array.isArray(data)
            ? data.find(
                (app) =>
                  (app.userId === (user._id || user.id) ||
                    app.userId?._id === (user._id || user.id)) &&
                  (app.jobId === id || app.jobId?._id === id)
              )
            : null;
          setUserApplication(matched || null);
        }
      } catch (err) {
        console.error("Failed to fetch user application", err);
        setUserApplication(null);
      }
    };

    fetchJob();
    fetchSimilarJobs();
    fetchUserApplication();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("coverLetter", formData.coverLetter);
    form.append("resume", formData.resume);
    if (user && (user._id || user.id)) {
      form.append("userId", user._id || user.id);
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/apply`,
      {
        method: "POST",
        body: form,
      }
    );
    if (res.ok) {
      setApplicationSubmitted(true);
      setFormData({
        name: "",
        email: "",
        resume: null,
        coverLetter: "",
      });
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Back to job listings
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Back to job listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {job.title} | {job.company?.name} | CareerConnect
        </title>
        <meta
          name="description"
          content={`Apply for ${job.title} position at ${job.company?.name}`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              // href="/jobs"
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
            >
              {/* <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg> */}
              <FiArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="relative">
                    {/* Mobile: job type badge absolute top right */}
                    {/* <div className="absolute right-0 top-0 mt-2 mr-2 hidden z-10">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.type}
                      </div>
                    </div> */}
                    {/* Desktop: inline row */}
                    <div className="hidden sm:flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h1>
                        <div className="flex items-center text-gray-600 mb-4">
                          <FiBriefcase className="mr-1.5 text-gray-500" />
                          <span className="mr-4">{job.company?.name}</span>
                          <FiMapPin className="mr-1.5 text-gray-500" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.type}
                        </div>
                        {/* Desktop Apply Button */}
                        <button
                          className={`ml-2 px-4 py-2 rounded-md font-medium transition ${
                            !user
                              ? "bg-gray-500 text-white cursor-pointer"
                              : userApplication
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={async () => {
                            if (!user) {
                              router.push("/login");
                              return;
                            }
                            if (userApplication) {
                              alert("You have already applied for this job.");
                              return;
                            }
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}/apply`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    userId: user._id || user.id,
                                    name: user.name,
                                    email: user.email,
                                    jobId: job._id,
                                    companyId: job.company?._id,
                                    status: "applied",
                                  }),
                                }
                              );
                              if (res.ok) {
                                alert("Application submitted successfully.");
                                setUserApplication({
                                  userId: user._id || user.id,
                                  jobId: job._id,
                                  status: "applied",
                                });
                              } else {
                                const errData = await res.json();
                                alert(errData.message || "Application failed.");
                              }
                            } catch (err) {
                              alert("Something went wrong.");
                            }
                          }}
                          disabled={!!userApplication}
                        >
                          {!user
                            ? "Login to Apply"
                            : userApplication
                            ? "Already Applied"
                            : "Apply"}
                        </button>
                      </div>
                    </div>
                    {/* Mobile: title and company/location */}
                    <div className="sm:hidden">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 break-words max-w-[70%] min-w-[30%]">
                          {job.title}
                        </h1>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 mt-1">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-gray-600 mb-4 text-sm gap-x-2 gap-y-1">
                        <span className="truncate max-w-[60%] flex items-center">
                          <FiBriefcase className="mr-1.5 text-gray-500 flex-shrink-0" />
                          {job.company?.name}
                        </span>
                        <span className="truncate flex items-center">
                          <FiMapPin className="mr-1.5 text-gray-500 flex-shrink-0" />
                          {job.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between  gap-x-4 gap-y-1 text-base mt-2 ">
                        <span className="font-semibold text-gray-900 flex items-center">
                          <FaRupeeSign className="mr-1 text-green-600" />
                          {job.salary} LPA
                        </span>
                        <span className="font-semibold text-gray-900 flex items-center">
                          <FiClock className="mr-1 text-blue-600" />
                          {job.experience}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiCalendar className="mr-1" />
                          Posted{" "}
                          {new Date(job.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className=" items-center justify-between mt-2 hidden md:flex">
                    <span className="text-lg font-semibold text-gray-900 flex items-center">
  <FaRupeeSign className="mr-1.5 text-green-600 opacity-80 w-4 h-4" />
                      {job.salary} LPA
                    </span>
                    <span className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiClock className="mr-1.5 text-blue-600" />
                      {job.experience}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="mr-1.5" />
                      Posted{" "}
                      {new Date(job.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  {/* Mobile Apply Button below post time */}
                  <div className="block sm:hidden mt-4">
                    <button
                      className={`w-full px-4 py-3 rounded-md font-bold transition text-base ${
                        !user
                          ? "bg-gray-500 text-white cursor-pointer"
                          : userApplication
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={async () => {
                        if (!user) {
                          router.push("/login");
                          return;
                        }
                        if (userApplication) {
                          alert("You have already applied for this job.");
                          return;
                        }
                        try {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}/apply`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                userId: user._id || user.id,
                                name: user.name,
                                email: user.email,
                                jobId: job._id,
                                companyId: job.company?._id,
                                status: "applied",
                              }),
                            }
                          );
                          if (res.ok) {
                            alert("Application submitted successfully.");
                            setUserApplication({
                              userId: user._id || user.id,
                              jobId: job._id,
                              status: "applied",
                            });
                          } else {
                            const errData = await res.json();
                            alert(errData.message || "Application failed.");
                          }
                        } catch (err) {
                          alert("Something went wrong.");
                        }
                      }}
                      disabled={!!userApplication}
                    >
                      {!user
                        ? "Login to Apply"
                        : userApplication
                        ? "Already Applied"
                        : "Apply"}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiFileText className="mr-2 text-blue-600" />
                    Job Description
                  </h2>
                  <p className="text-gray-700 mb-6 whitespace-pre-line">
                    {job.description}
                  </p>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FiList className="mr-2 text-green-600" />
                    Responsibilities
                  </h3>
                  {Array.isArray(job.responsibilities) &&
                    job.responsibilities.length > 0 && (
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        {job.responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FiCheckSquare className="mr-2 text-purple-600" />
                    Requirements
                  </h3>{" "}
                  {Array.isArray(job.requirements) &&
                    job.requirements.length > 0 && (
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        {job.requirements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FiGift className="mr-2 text-yellow-600" />
                        Benefits
                      </h3>{" "}
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        {job.benefits.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FiInfo className="mr-2 text-gray-600" />
                    About {job?.company?.name}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job?.company?.description}
                  </p>
                </div>
              </div>

              {/* Similar Jobs (would be dynamic in a real app) */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Similar Jobs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similarJobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded shadow">
                      <h3 className="font-semibold flex items-center">
                        <FiBriefcase className="mr-2 text-blue-600" />
                        {job.title}
                      </h3>
                      <p className="flex items-center mt-1">
                        <FiMapPin className="mr-2 text-gray-500" />
                        {job.company?.name} • {job.location}
                      </p>
                      <Link
                        href={`/jobs/${job._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}

            <div className="lg:col-span-1">
              <CompanyOverviewCard job={job} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
