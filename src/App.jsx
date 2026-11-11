
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Applications from "./pages/Applications";
import ApplicationStatus from "./pages/ApplicationStatus";
import Certificates from "./pages/Certificates";
import CertificateUpload from "./pages/CertificateUpload";
import ApplicationForm from "./components/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Applications />} />
            <Route path="/apply" element={<ApplicationForm />} />
            <Route path="/status" element={<ApplicationStatus />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route
              path="/upload-certificate"
              element={<CertificateUpload />}
            />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
