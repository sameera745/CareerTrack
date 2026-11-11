
import { useState } from "react";

function CertificateUpload() {
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!certificateFile) {
      setError("Please select a certificate file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before uploading a certificate.");
      return;
    }

    const formData = new FormData();
    formData.append("certificateName", certificateName);
    formData.append("issuingOrganization", issuingOrganization);
    formData.append("certificateFile", certificateFile);

    try {
      const response = await fetch(
        "https://careertrack-1-vhdt.onrender.com/api/certificates",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload certificate");
      }

      alert("Certificate uploaded successfully!");

      setCertificateName("");
      setIssuingOrganization("");
      setCertificateFile(null);

      document.getElementById("certificateFile").value = "";
    } catch (error) {
      console.error("Certificate upload error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Upload Certificate</h1>
          <p>Add a certificate to your personal collection.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Certificate Name</label>

            <input
              type="text"
              value={certificateName}
              onChange={(event) =>
                setCertificateName(event.target.value)
              }
              placeholder="e.g. Web Development Certificate"
              required
            />
          </div>

          <div className="form-group">
            <label>Issuing Organization</label>

            <input
              type="text"
              value={issuingOrganization}
              onChange={(event) =>
                setIssuingOrganization(event.target.value)
              }
              placeholder="e.g. Coursera"
              required
            />
          </div>

          <div className="form-group">
            <label>Certificate File</label>

            <input
              id="certificateFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) =>
                setCertificateFile(event.target.files[0])
              }
              required
            />
          </div>

          {error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          <button
            type="submit"
            className="primary-button"
          >
            Upload Certificate
          </button>
        </form>
      </div>
    </div>
  );
}

export default CertificateUpload;
