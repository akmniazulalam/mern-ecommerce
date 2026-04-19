import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext(); // context api diye state manage kora jay globally. jodi kokhono emon hoy je ekta data puro app er moddhe jekono jaygay dorkar hote pare ar multiple time use kora lagte pare tokhon erokom globally seta ke access kora jay tai just ekbar banano hoy ar pore seta ke provide kore dewa hoy app e jate kore ekbar create korei setake barbar use korte pari. eta react er built in system e korar system ta hocche context api. sobar first e context create korte hoy. context bane hocche ekta container ba box. jei box er moddhe rakha hoy data. context create kore seta ke jei variable e rakha hoy setar naam capital letter e suru hoy normally ar sathe Context o thake.

export const AuthProvider = ({ children }) => {   // context create korar porer step hocche provider banano. context je create korechi setar moddhe primarily kichui thakena. provider er maddhome sei context ba container ba box er moddhe data dhukiye erpor puro app ke ei provider er moddhe wrap kore puro app e provide kore dewa hoy. eta ekta wrapping container. jehetu wrapping container tai children thakbe etar. ar ei children tai hocche app.jsx. etar naam o oi context create korar variable er motoi.
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
      {children}
    </AuthContext.Provider>
    // ekhane oi context ta je create korechilam setar moddhe ki ki value ba data pass kore pore use korte chacchi seta diye dite hoy ei .Provider diye.
  );
};

export const useAuth = () => useContext(AuthContext); // context ta create korlam ar provider er maddhome setar moddhe data joma rakhlam ar sei wrapping container provider er moddhe app.jsx ke wrap kore dilam main.jsx er moddhe jate puro app er jekono file ei ei data ke access kora jay ba use kora jay. kintu ei context ba container ba box er moddhe je data ta ache seta use korar jonno useContext naamer ekta hook lage. eta shudhu matro createContext diye create kora context er variable takei ney. provider variable ke na. ekhon jekono file e ei context er data ke use korte parbo eivabe: const {user, setUser} = useAuth()
