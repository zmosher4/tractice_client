import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const existDialog = useRef();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/login`, {
      method: 'POST',
      body: JSON.stringify({ username: email, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo.token) {
          localStorage.setItem('token', JSON.stringify(authInfo));
          navigate('/');
        } else {
          existDialog.current.showModal();
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        existDialog.current.showModal();
      });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <dialog className="dialog dialog--auth" ref={existDialog}>
        <div className="p-4 text-center">User does not exist</div>
        <button
          className="mt-2 p-2 bg-blue-500 text-white rounded-md"
          onClick={(e) => existDialog.current.close()}
        >
          Close
        </button>
      </dialog>

      <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form className="flex flex-col" onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold text-center mb-4">Tractice</h1>
          <h2 className="text-xl text-center mb-6">Please sign in</h2>
          <fieldset className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="inputEmail"
            >
              Email address
            </label>
            <input
              type="email"
              id="inputEmail"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Email address"
              required
              autoFocus
            />
          </fieldset>
          <fieldset className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="inputPassword"
            >
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Password"
              required
            />
          </fieldset>
          <fieldset>
            <button
              type="submit"
              className="mt-4 p-3 rounded-md bg-blue-800 text-white hover:bg-blue-700 transition"
            >
              Sign in
            </button>
          </fieldset>
        </form>
        <div className="mt-6 text-center">
          <Link
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            to="/register"
          >
            Not a member yet?
          </Link>
        </div>
      </section>
    </main>
  );
};
