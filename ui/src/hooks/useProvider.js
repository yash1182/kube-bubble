import { useContext } from "react";
import Context from "../contexts/ContextProvider";

const useProvider = () => {
  return useContext(Context);
};
export default useProvider;
