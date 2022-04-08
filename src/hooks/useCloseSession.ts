
import { useState } from "react";
import { logout } from "../service/AuthClient";
import useStorage, { Actions, StorageVar } from "./useStorage";


const useCloseSession = (token: string):[boolean, ()=> void, React.Dispatch<React.SetStateAction<boolean>>] => {

    const [close, setClose] = useState<boolean>(false);
    
    const [attribute, storageAction] = useStorage();
    
    const closeSession = () => {
        logout(token)
        .then(() => {
          storageAction({
            name: StorageVar.TOKEN,
            action: Actions.DELETE,
          });
          setClose(true);
        })
        .catch(() => {
            setClose(false);
        });
    }

    return [close, closeSession, setClose]
}

export default useCloseSession