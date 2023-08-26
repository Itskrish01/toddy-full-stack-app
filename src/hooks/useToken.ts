import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

export const useToken = () => {
  const context = useContext(TokenContext);

  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }

  return context;
};
