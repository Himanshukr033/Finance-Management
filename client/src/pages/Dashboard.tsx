import { SignedOut, useUser } from "@clerk/clerk-react";
import RecordForm from "../components/RecordForm";
import RecordList from "../components/RecordList";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <SignedOut>
      <Navigate to="/auth" />
    </SignedOut>
      <h1 style={{textAlign:"center", margin:5}}> Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <RecordForm/>
      <RecordList/>
    </div>
  );
};

export default Dashboard;