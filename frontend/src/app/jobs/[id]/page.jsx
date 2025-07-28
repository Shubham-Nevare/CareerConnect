"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useMemo } from "react";
import { FiCalendar, FiDollarSign, FiMapPin } from "react-icons/fi";
import CompanyOverviewCard from "./components/CompanyOverviewCard";

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

      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              // href="/jobs"
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
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
              </svg>
              Back
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <span className="mr-4">{job.company?.name}</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.type}
                      </div>
                      {/* <button
                        className={`ml-2 px-4 py-2 rounded-md font-medium transition ${
                          !user
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : userApplication?.userId ===
                                (user?._id || user?.id) &&
                              userApplication?.jobId === job._id
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        onClick={async () => {
                          // Case 1: User not logged in
                          if (!user) {
                            alert("Please log in to apply.");
                            return;
                          }

                          // Case 2: Already applied
                          if (
                            userApplication?.userId === (user._id || user.id) &&
                            userApplication?.jobId === job._id
                          ) {
                            alert("Already Applied.");
                            return;
                          }

                          // Case 3: Apply for the job
                          try {
                            const res = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}/apply`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`, // Add auth token if needed
                                },
                                body: JSON.stringify({
                                  userId: user._id || user.id,
                                  name: user.name, // Add name
                                  email: user.email, // Add email
                                  jobId: job._id,
                                  companyId: job.company?._id,
                                  status: "applied",
                                }),
                              }
                            );

                            if (res.ok) {
                              // Update UI immediately for better UX
                              setUserApplication({
                                userId: user._id || user.id,
                                jobId: job._id,
                                status: "applied",
                              });

                              // Optional: Show toast instead of alert
                              alert("Application submitted successfully!");
                            } else {
                              const errorData = await res.json();
                              alert(
                                errorData.message ||
                                  "Failed to submit application"
                              );
                            }
                          } catch (err) {
                            console.error("Application error:", err);
                            alert("Network error. Please try again.");
                          }
                        }}
                        disabled={
                          !user ||
                          (userApplication?.userId ===
                            (user?._id || user?.id) &&
                            userApplication?.jobId === job._id)
                        }
                      >
                        {!user
                          ? "Apply" // Shows "Apply" but will show login prompt when clicked
                          : userApplication?.userId === (user._id || user.id) &&
                            userApplication?.jobId === job._id
                          ? userApplication.status
                            ? userApplication.status.charAt(0).toUpperCase() +
                              userApplication.status.slice(1)
                            : "Applied"
                          : "Apply"}
                      </button> */}

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
                            router.push("/login"); // or alert("Login to apply")
                            return;
                          }

                          if (userApplication) {
                            alert("You have already applied for this job.");
                            return;
                          }

                          // Submit application
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
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      {job.salary / 100000} LPA
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {job.experience}
                    </span>
                    <span className="text-sm text-gray-500">
                      Posted {job.posted}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Job Description
                  </h2>
                  <p className="text-gray-700 mb-6">{job.description}</p>

                  <h3 className="text-lg font-semibold mb-3">
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

                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
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
                      <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        {job.benefits.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h3 className="text-lg font-semibold mb-3">
                    About {job.company?.name}
                  </h3>
                  <p className="text-gray-700">{job.companyDescription}</p>
                </div>
              </div>

              {/* Similar Jobs (would be dynamic in a real app) */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Similar Jobs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similarJobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded shadow">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p>
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
