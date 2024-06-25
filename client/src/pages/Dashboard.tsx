import { useUser } from "@clerk/clerk-react";
// import "./financial-record.css";
// import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";
import RecordForm from "../components/RecordForm";
import RecordList from "../components/RecordList";
const Dashboard = () => {
  const { user } = useUser();
//   const { records } = useFinancialRecords();

//   const totalMonthly = useMemo(() => {
//     let totalAmount = 0;
//     records.forEach((record) => {
//       totalAmount += record.amount;
//     });

//     return totalAmount;
//   }, [records]);

  return (
    <div className="dashboard-container">
      <h1> Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <RecordForm/>
      {/* <div>Total Monthly: ${totalMonthly}</div> */}
      <RecordList/>
    </div>
  );
};

export default Dashboard;