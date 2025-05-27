import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Login() {
  const navigate = useNavigate(); // 👈 navigation hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Logging in...');
      // Fake login success
      navigate('/dashboard'); // 👈 Redirect to Dashboard
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-dark-blue ">
      <form onSubmit={handleSubmit} className=" p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-sky-custom mb-6">Log-In</h2>

        <label className="block mb-2 text-sm font-medium text-sky-custom">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-1 border border-white text-white rounded "
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        <label className="block mb-2 text-sm font-medium text-sky-custom">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-1 border border-white text-white rounded"
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Log In
        </button>
      </form>
    </div>
  );
}