import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Notes from './components/Notes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Notes toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
