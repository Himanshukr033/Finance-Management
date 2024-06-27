import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import  Auth from "./pages/Auth";
import { SignedIn, UserButton } from "@clerk/clerk-react";
// import { dark } from "@clerk/themes";
import "./App.css";
function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link to="/"> Dashboard</Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <Routes>
          <Route
            path="/"
            element={
                <Dashboard />
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
