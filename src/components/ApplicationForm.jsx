
import { useState } from "react";

function ApplicationForm() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    applicationDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in before submitting an application.");
      }

      const response = await fetch(
        "https://careertrack-1-vhdt.onrender.com/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit application"
        );
      }

      alert("Application submitted successfully!");

      setFormData({
        company: "",
        position: "",
        applicationDate: "",
      });
    } catch (error) {
      console.error("Application submission error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Apply for Internship</h1>
          <p>Add a new internship application to your tracker.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>

            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            >
              <option value="">Select a company</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="TCS">TCS</option>
              <option value="Infosys">Infosys</option>
              <option value="Wipro">Wipro</option>
              <option value="Accenture">Accenture</option>
              <option value="Deloitte">Deloitte</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Position</label>

            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineering Intern"
              required
            />
          </div>

          <div className="form-group">
            <label>Application Date</label>

            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
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
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
