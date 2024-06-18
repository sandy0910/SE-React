
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import DashboardAdmin from './Admin/DashboardAdmin';
import DashboardStaff from './Staff/DashboardStaff';
import DashboardStudent from './Student/DashboardStudent';
import ForgetPassword from './components/ForgetPassword';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/forget-password' element={<ForgetPassword/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<DashboardAdmin />} />
          <Route path="/staff/*" element={<DashboardStaff />} />
          <Route path="/student/*" element={<DashboardStudent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
