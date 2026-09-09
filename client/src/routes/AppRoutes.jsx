import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateSession from "../pages/CreateSession";
import SessionDetail from "../pages/SessionDetail";
import Roadmap from "../pages/Roadmap";

import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";
import Assessment from "../pages/Assessment";
import Result from "../pages/Result";
import RoadmapRevision from "../pages/RoadmapRevision";
import CodingProblems from "../pages/codingProblems";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/:sessionId"
        element={
          <ProtectedRoute>
            <Navbar />
            <SessionDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/session"
        element={
          <ProtectedRoute>
            <Navbar />
            <CreateSession />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap/:sessionId"
        element={
          <ProtectedRoute>
            <Navbar />
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assessment/:assessmentId"
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assessment/result/:itemId"
        element={
          <ProtectedRoute>
            <Navbar />
            <Result />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap/revision"
        element={
          <ProtectedRoute>
            <Navbar />
            <RoadmapRevision />
          </ProtectedRoute>
        }
      />

      <Route 
         path="/coding-problems/:sessionId" 
         element={
         <ProtectedRoute>
           <Navbar />
           <CodingProblems />
         </ProtectedRoute> } />
    </Routes>
  );
};

export default AppRoutes;
