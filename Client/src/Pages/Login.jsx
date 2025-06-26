import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [errors, setErrors] = useState({ 
    email: '', 
    passwordLength: '',
    passwordUpperCase: '',
    passwordSpecialChar: ''
  });

  const validate = () => {
    let valid = true;
    const newErrors = { 
      email: '', 
      passwordLength: '',
      passwordUpperCase: '',
      passwordSpecialChar: ''
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 6) {
      newErrors.passwordLength = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!hasUpperCase) {
      newErrors.passwordUpperCase = 'Password must include at least 1 capital letter';
      valid = false;
    }
    
    if (!hasSpecialChar) {
      newErrors.passwordSpecialChar = 'Password must include at least 1 special character';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoginError('');

    if (validate()) {
      try {
        const response = await fetch('http://localhost:5001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', { status: response.status, data }); // Debug log

        if (response.ok) {
          // Store user data including role
          localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
        } else {
          setLoginError(data.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-blue">
      <div className="w-full max-w-md p-8 mx-4">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-sky-custom mb-2">Welcome to EcoDive Admin System</h1>
            <p className="text-gray-400">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-sky-custom mb-2">Email</label>
              <input
                data-test='email'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-opacity-10 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Enter your email"
              />
              {isSubmitted && errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-custom mb-2">Password</label>
              <div className="relative">
              <input
                data-test='password'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-opacity-10 bg-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="••••••••"
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                </button>
              </div>
              {isSubmitted && errors.passwordLength && <p className="mt-1 text-red-500 text-sm">{errors.passwordLength}</p>}
              {isSubmitted && errors.passwordUpperCase && <p className="mt-1 text-red-500 text-sm">{errors.passwordUpperCase}</p>}
              {isSubmitted && errors.passwordSpecialChar && <p className="mt-1 text-red-500 text-sm">{errors.passwordSpecialChar}</p>}
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 font-medium"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 