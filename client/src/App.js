import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './componants/register';
import Login from './componants/login';
import DashboardLayoutSlots from './componants/dash';
import HomeApp from './componants/Home';
import UserProfile from './componants/UserProfile';
import ProductCard from './componants/Porduct';
import MainLayout from './componants/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeApp />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/products" element={<ProductCard />} />

        </Route>

        {/* Dashboard without Navbar/Footer */}
        <Route path="/dashboard" element={<DashboardLayoutSlots />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
