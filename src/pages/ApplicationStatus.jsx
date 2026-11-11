
import { useEffect, useState } from "react";

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view application status.");
        }

        const response = await fetch(
          "http://localhost:5000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Application Status</h1>
          <p>Track the progress of your internship applications.</p>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p>Loading application status...</p>
        </div>
      ) : error ? (
        <div className="card">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card">
          <h3>No applications found</h3>
          <p>
            Your submitted internship applications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application._id}
            >
              <div className="application-card-header">
                <div>
                  <h2>{application.company}</h2>

                  <p className="application-position">
                    {application.position}
                  </p>
                </div>

                <span className="status-badge">
                  {application.status}
                </span>
              </div>

              <div className="application-details">
                <div>
                  <span>Application Date</span>
                  <strong>{application.applicationDate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicationStatus;
