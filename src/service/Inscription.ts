import HttpClient from './HttpClient';

interface Request {
    idCourse: string;
    code: string;
    token: string;
}

export const startInscription = (req: Request):Promise<boolean> => {
    const uri = `/api/courses/v1/${req.idCourse}/enroll?code=${req.code}`;
    return HttpClient.request<any>({ 
    headers: { authorization: `bearer ${req.token}` },
    method: "post",
    url: uri,
    })
    .then((res) => true)
    .catch((e)=> {
        console.log("Algo salio mal en consumir el inscription", e)
        return false
    })
}
