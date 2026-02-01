import { useEffect, useState } from "react";
import { getApplicantsByJob } from "../services/employerService";

export default function ApplicantsList() {
  const [apps, setApps] = useState([]);

  // TEMP: hardcoded jobId
  const jobId = 1;

  useEffect(() => {
    getApplicantsByJob(jobId).then((res) => setApps(res.data));
  }, []);

  return (
    <div>
      <h3>Applicants</h3>
      {apps.map((a) => (
        <div key={a.id} style={{ border: "1px solid #ccc", margin: "10px" }}>
          <p>User ID: {a.userId}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}
