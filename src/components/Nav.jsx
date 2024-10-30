import { NavLink, useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md mb-10">
      <nav className="flex items-center justify-between h-20 mx-28">
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-purple-700"
        >
          Tractice
        </NavLink>
        <div className="flex items-center space-x-12">
          <NavLink
            to="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Shows
          </NavLink>
          <NavLink
            to="/sessions"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Sessions
          </NavLink>
          {localStorage.getItem('token') !== null ? (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="text-gray-700 hover:text-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                className="text-gray-700 hover:text-blue-600 transition"
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className="text-gray-700 hover:text-blue-600 transition"
                to="/register"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
