import { React, useState, createContext } from "react";

export const MainContext = createContext();

export function MainState(props) {
  const [bets, setBets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [betsLength, setBetsLength] = useState(0);
  return (
    <MainContext.Provider
      value={{
        bets,
        setBets,
        betsLength,
        setBetsLength,
        isOpen,
        setIsOpen,
        token,
        setToken,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
