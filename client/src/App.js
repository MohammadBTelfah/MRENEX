import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './componants/register';
import Login from './componants/login';
import DashboardLayoutSlots from './componants/dash';
import HomeApp from './componants/Home';
import UserProfile from './componants/UserProfile';
import ProductCard from './componants/Porduct';
import MainLayout from './componants/MainLayout';
import Cart from './componants/itemcart';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🟢 Public pages without layout */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🟦 Pages with navbar/footer inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeApp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/products" element={<ProductCard />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* 🟣 Dashboard with separate layout */}
        <Route path="/dashboard" element={<DashboardLayoutSlots />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
