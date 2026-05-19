// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Projects from "./pages/Projects";
// import Skills from "./pages/Skills";
// import Reviews from "./pages/Reviews";
// import Contact from "./pages/Contact";
// import Login from "./admin/login";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-dark)" }}>
//         <Navbar />
//         <main className="flex-1">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/skills" element={<Skills />} />
//             <Route path="/reviews" element={<Reviews />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<Login />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// }



// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Projects from "./pages/Projects";
// import Skills from "./pages/Skills";
// import Reviews from "./pages/Reviews";
// import Contact from "./pages/Contact";
// import Login from "./admin/login";
// import Dashboard from "./admin/Dashboard";


// function Layout() {
//   const location = useLocation();

//   // Pages where Navbar & Footer should be hidden
//   const hideLayout = location.pathname === "/admin" || location.pathname === "/dashboard";

//   return (
//     <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-dark)" }}>

//       {!hideLayout && <Navbar />}

//       <main className="flex-1">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/skills" element={<Skills />} />
//           <Route path="/reviews" element={<Reviews />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/admin" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </main>

//       {!hideLayout && <Footer />}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Layout />
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ProfileProvider } from "./Context/profileContext";
import { SettingsProvider } from "./Context/settingContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import DashboardLayout from "./admin/DashboardLayout";
import Project from "./admin/Project";
import Review from "./admin/Review";
import Contacts from "./admin/Contacts";
import Skill from "./admin/Skill";
import ReviewRequests from "./admin/ReviewRequests";
import Education from "./admin/Education";
import Experience from "./admin/Experience";
import AboutSection from "./admin/AboutSection";
import Setting from "./admin/Setting";



// 🔐 Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin" />;
}


function Layout() {
  const location = useLocation();

  // Hide Navbar/Footer on admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-dark)" }}>

      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Login */}
          <Route path="/admin" element={<Login />} />

          {/* Admin Dashboard (Protected + Sidebar Layout) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

          </Route>

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Project />} />
          </Route>


          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Skill />} />
          </Route>

          <Route
            path="/admin/education"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Education />} />
          </Route>

          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Experience />} />
          </Route>

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Review />} />
          </Route>

          <Route
            path="/admin/review-requests"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ReviewRequests />} />
          </Route>


          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Contacts />} />
          </Route>

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AboutSection />} />
          </Route>

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Setting />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </SettingsProvider>
    </ProfileProvider>
  );
}
