import { useState } from "react";
import axios from "axios";

export default function CreateJobForm() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    jobType: "",
    salary: "",
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/jobs",
        {
          ...job,
          salary: Number(job.salary), // IMPORTANT
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Job created successfully");

      setJob({
        title: "",
        company: "",
        location: "",
        description: "",
        jobType: "",
        salary: "",
      });
    } catch (err) {
      alert("Error creating job");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Job</h3>

      <input
        name="title"
        placeholder="Job Title"
        value={job.title}
        onChange={handleChange}
        required
      />

      <input
        name="company"
        placeholder="Company"
        value={job.company}
        onChange={handleChange}
        required
      />

      <input
        name="location"
        placeholder="Location"
        value={job.location}
        onChange={handleChange}
        required
      />

      <select
        name="jobType"
        value={job.jobType}
        onChange={handleChange}
        required
      >
        <option value="">Select Job Type</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="CONTRACT">Contract</option>
      </select>

      <input
        name="salary"
        type="number"
        placeholder="Salary"
        value={job.salary}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Job Description"
        value={job.description}
        onChange={handleChange}
        required
      />

      <button type="submit">Create Job</button>
    </form>
  );
}
