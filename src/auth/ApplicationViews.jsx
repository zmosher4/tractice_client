import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authorized } from './Authorized';
import { Register } from './Register';
import { Login } from './Login';
import App from '../App';
import { Sessions } from '../components/Sessions';
import { NewShow } from '../components/NewShow';

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<App />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/new-show" element={<NewShow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
