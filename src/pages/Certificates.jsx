
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("https://careertrack-1-vhdt.onrender.com/api/certificates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }

        return response.json();
      })
      .then((data) => {
        setCertificates(data);
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDownload = async (certificate) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first.");
        return;
      }

      const response = await fetch(
        `https://careertrack-1-vhdt.onrender.com/api/certificates/${certificate._id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Certificate download failed");
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = certificate.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to download certificate.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Certificates</h1>
          <p>Store and manage your professional certificates.</p>
        </div>

        <Link to="/upload-certificate">
          <button className="primary-button">
            + Upload Certificate
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="card">
          <p>Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="card">
          <h3>No certificates yet</h3>
          <p>
            Upload your first certificate to build your professional
            collection.
          </p>
        </div>
      ) : (
        <div className="grid">
          {certificates.map((certificate) => (
            <div
              className="application-card"
              key={certificate._id}
            >
              <div className="application-card-header">
                <div>
                  <h2>{certificate.certificateName}</h2>

                  <p className="application-position">
                    {certificate.issuingOrganization}
                  </p>
                </div>
              </div>

              <div className="application-details">
                <div>
                  <span>Certificate File</span>
                  <strong>{certificate.fileName}</strong>
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <button
                  className="primary-button"
                  onClick={() => handleDownload(certificate)}
                >
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificates;
