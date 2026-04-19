import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/auth/currentuser", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
