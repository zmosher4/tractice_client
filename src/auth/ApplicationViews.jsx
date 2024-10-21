import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authorized } from './Authorized';
import { Register } from './Register';
import { Login } from './Login';
import App from '../App';

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
