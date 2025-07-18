import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './componants/register';
import Login from './componants/login';
import DashboardLayoutSlots from './componants/dash';
import HomeApp from './componants/Home'; // تأكد من اسم الملف الفعلي
import UserProfile from './componants/UserProfile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/dashboard" element={<DashboardLayoutSlots />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/profile" element={<UserProfile />} />
     
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
