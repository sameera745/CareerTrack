
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view applications.");
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

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const otherStatusCount = applications.filter(
    (application) => application.status !== "Applied"
  ).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Internship Applications</h1>
          <p>Track and manage your internship applications.</p>
        </div>

        <Link to="/apply">
          <button className="primary-button">
            + Apply for Internship
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="card">
          <p>Loading applications...</p>
        </div>
      ) : error ? (
        <div className="card">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid">
            <div className="card">
              <p>Total Applications</p>
              <h2>{totalApplications}</h2>
            </div>

            <div className="card">
              <p>Applied</p>
              <h2>{appliedCount}</h2>
            </div>

            <div className="card">
              <p>Other Status</p>
              <h2>{otherStatusCount}</h2>
            </div>
          </div>

          <br />

          {applications.length === 0 ? (
            <div className="card">
              <h3>No applications yet</h3>
              <p>
                Start by submitting your first internship application.
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
        </>
      )}
    </div>
  );
}

export default Applications;
