import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from "react-hot-toast";
import { getCurrentUserThunk } from './redux/auth/authSlice';
import AppRoutes from "./routes/AppRoutes";
import ThemeToggle from './components/ThemeToggle';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUserThunk());
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ThemeToggle />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default App;
