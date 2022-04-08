import { createContext } from "react";

export type TokenContent = {
  token: string
  setToken: (token: string) => void
};

 export const TokenContext = createContext<TokenContent>({
   token: "",
   setToken: () => {}
 });
