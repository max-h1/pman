import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  //Navigate,
} from "react-router-dom";

import Dashboard from "./Components/Routes/Dashboard";
import Login from "./Components/Routes/Login";
import PrivateRoute from "./Components/Routes/PrivateRoute";
//import Signup from "./Components/Routes/Signup";
import AuthProvider from "./Components/Providers/Authprovider";
import Home from "./Components/Routes/Home";
import Register from "./Components/Routes/Register";

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
