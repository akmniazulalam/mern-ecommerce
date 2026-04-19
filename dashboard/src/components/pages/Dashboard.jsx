import React, { useEffect, useState } from "react";
import StatsCard from "../StatsCard";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  // const [currentUser, setCurrentUser] = useState(null);

  // useEffect(() => {
  //   const user = async () => {
  //     try {
  //       const res = await axios.get(
  //         "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/currentuser",
  //         {
  //           withCredentials: true,
  //         },
  //       );

  //       setCurrentUser(res.data.user);
  //     } catch (error) {
  //       console.error("Error fetching current user:", error);
  //     }
  //   };
  //   user();
  // }, []);

  const {user} = useAuth()

  return (
    <>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
      <div className="space-y-8">
      <h2 className="md:text-4xl font-bold text-xl">
        Welcome {user?.firstName} {user?.lastName} to Dashboard
      </h2>
      <div className="grid md:grid-cols-4 gap-6 md:text-2xl">
        <StatsCard title="Total Revenue" value="$45,231" />
        <StatsCard title="Orders" value="1,350" />
        <StatsCard title="Customers" value="820" />
        <StatsCard title="Products" value="120" />
      </div>
    </div> 
    </>
  );
};

export default Dashboard;
