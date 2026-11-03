
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public home page */}
        <Route path="/" element={<HomePage />} />

        {/* Customer pages */}
        <Route path="/book" element={<CustomerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin pages - we'll implement these next */}
        <Route
          path="/admin/login"
          element={<h1>Admin Login Coming Soon</h1>}
        />

        <Route
          path="/admin"
          element={<h1>Admin Dashboard Coming Soon</h1>}
        />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
