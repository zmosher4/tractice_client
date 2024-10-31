import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Authorized } from './Authorized';
import { Register } from './Register';
import { Login } from './Login';
import App from '../App';
import { Sessions } from '../components/Sessions';
import { NewShow } from '../components/NewShow';
import { EditShow } from '../components/EditShow';
import { ShowDetails } from '../components/ShowDetails';
import { ShowsProvider } from '../state/ShowsContext';
import { SessionDetails } from '../components/SessionDetails';
import { NewSession } from '../components/NewSession';
import { EditSession } from '../components/EditSession';
import { SessionsProvider } from '../state/SessionsContext';
export const ApplicationViews = () => {
  return (
    <ShowsProvider>
      <SessionsProvider>
        {/* Remove basename if it's there */}
        <BrowserRouter>
          <Routes>
            {/* Move these outside of Authorized */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Auth routes */}
            <Route element={<Authorized />}>
              <Route path="/" element={<App />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/session/:sessionId" element={<SessionDetails />} />
              <Route path="/session/:showId/create" element={<NewSession />} />
              <Route
                path="/edit-session/:sessionId"
                element={<EditSession />}
              />
              <Route path="/new-show" element={<NewShow />} />
              <Route path="/edit-show/:showId" element={<EditShow />} />
              <Route path="/show/:showId" element={<ShowDetails />} />
              {/* Add catch-all inside Authorized */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            {/* Add catch-all outside Authorized for non-auth routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionsProvider>
    </ShowsProvider>
  );
};
