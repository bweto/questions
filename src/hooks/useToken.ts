import { useContext } from "react";
import { useHistory } from "react-router-dom";
import HttpClient from "../service/HttpClient";
import useStorage, { Actions, StorageVar } from "./useStorage";
import { TokenContext } from "./useTokenContext";

interface AuthResponse {
    bearer: string;
  }

interface UserInforamtion {
    session_id: string
    email: string
    last_bearer_date: string
}

interface Jwt {
    data: UserInforamtion,
    iat: number
    exp: number
}

const useToken = ():[string, () => void, () => void] => {

    const { token, setToken } = useContext(TokenContext);
    const [attribute, storageAction] = useStorage();
    const history = useHistory();

    function validarJWT (token: string): boolean {
        const  base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const expiredDate = (JSON.parse(window.atob(base64)) as Jwt).exp;
        const now = new Date();
        return  now.getTime() > ((expiredDate - 600) * 1000)
    };

    const generateToken = () =>{
        if(token !== null      &&
           token !== undefined &&
           validarJWT(token)){
            HttpClient.get<AuthResponse>(
                "/authentication/v1/refresh",
                { headers: { 
                    authorization: `bearer ${token}`,
                    "Accept": "application/json"
                 }}
              ).then((rsp) =>{
                console.log("Nuevo", rsp)  
                const newToken = rsp.data.bearer;
                console.log("Nuevo", newToken) 
                setToken(newToken);
            }).catch((e: any) => {
                console.log("Fallo el refresh", e);
                setToken("");
                storageAction({
                    name: StorageVar.TOKEN,
                    action: Actions.DELETE,
                  })
                  history.push("/");
            })
        }
    }

    const deleteToken = () =>{
        setToken("");
    }    
    
    return [token, generateToken, deleteToken];
}

export default useToken;