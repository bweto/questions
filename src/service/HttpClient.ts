import Axios from 'axios';


const HttpClient = Axios.create({
  baseURL: "https://my-project-1546882152107.rj.r.appspot.com",
  timeout: 2000,
  timeoutErrorMessage: "Se supero el tiempo esperado"
});

export default HttpClient
