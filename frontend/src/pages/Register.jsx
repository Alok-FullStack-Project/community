import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retype_password, setRetypePassword] = useState('');
  const nav = useNavigate();

  

  const submit = async (e) => {
    e.preventDefault();
    try {

      if(password !== retype_password)
      {
         alert('Password and Retype password does not match.');
         return false;
      }

      const res = await api.post('/auth/register', { name, email,phone,description, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on role if needed
      if (res.data.user.role === 'admin') nav('/dashboard/admin/family-list');
      else if (res.data.user.role === 'manager') nav('/dashboard/manager/family-list');
      else nav('/community');
    } catch (err) {
      alert(err?.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
         <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Phone"
        />
         <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Description"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
        />
        <input
          value={retype_password}
          onChange={(e) => setRetypePassword(e.target.value)}
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Retype Password"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
