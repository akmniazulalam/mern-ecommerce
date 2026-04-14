import React, { useEffect, useState } from "react";
import StatsCard from "../StatsCard";
import axios from "axios";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = async () => {
      try {
        const res = await axios.get(
          "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/currentuser",
          {
            withCredentials: true,
          },
        );

        setCurrentUser(res.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    user();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold">
        Welcome {currentUser?.firstName} {currentUser?.lastName} to Dashboard
      </h2>
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value="$45,231" />
        <StatsCard title="Orders" value="1,350" />
        <StatsCard title="Customers" value="820" />
        <StatsCard title="Products" value="120" />
      </div>
    </div>
  );
};

export default Dashboard;
