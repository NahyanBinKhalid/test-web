// pages/login.js
'use client'

import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSuccess = (token) => {
    // Store the token in localStorage
    localStorage.setItem('token', token);
    // Redirect to profile page
    window.location.href = '/profile';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to external login endpoint using formData
      const response = await fetch('http://localhost:8080/login', {  // Replace 'https://example.com/api/login' with the actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Extract the token from response
        const data = await response.json();
        if (!data.error) {
          const token = data.data.token;
          // Call the function to handle successful login with token
          handleLoginSuccess(token);
        } else {
          const errorData = await response.json();
          setLoginError(errorData.message || 'Login failed');
        }
      } else {
        // Handle login failure
        const errorData = await response.json();
        setLoginError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
      setLoginError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="identity" className="sr-only">Email address</label>
              <input
                id="identity"
                name="identity"
                type="email"
                autoComplete="identity"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.identity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {loginError && (
            <p className="mt-2 text-sm text-red-600 text-center">{loginError}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
