import { NavLink, useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <ul className="navbar pb-10">
      <div className="my-4 mx-28">
        <nav className="flex items-center justify-between h-20">
          <NavLink to="/">Tractice</NavLink>
          <div className="flex">
            <div className="flex-row space-x-12">
              <NavLink to="/">Shows</NavLink>
              <NavLink to="/sessions">Sessions</NavLink>
              {localStorage.getItem('token') !== null ? (
                <li className="navbar__item">
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="navbar__item">
                    <NavLink
                      className="text-left underline text-blue-600 hover:text-purple-700"
                      to={'/login'}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className="navbar__item">
                    <NavLink
                      className="text-left underline text-blue-600 hover:text-purple-700"
                      to={'/register'}
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}{' '}
            </div>
          </div>
        </nav>
      </div>
    </ul>
  );
};
