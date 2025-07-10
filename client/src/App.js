
import './App.css';
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import Register from './componants/register';
import Login from './componants/login';
import DashboardLayoutSlots from './componants/dash';
function App() {
  return (
   <>
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<DashboardLayoutSlots />} />
       <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
   
     </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
