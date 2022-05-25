
import { useState, useEffect } from "react";
import useSpinner from "../hooks/useSpinner";
import useStorageExam, { Actions } from "../hooks/useStorageExam";
import useToken from "../hooks/useToken";
import HttpClient from "./HttpClient";

interface Props  {
    token: string
    idCourse: string
}

interface ExamResponse  {
    data: ExamData[]
}

interface ExamData  {
    _id: string
    idCourse: string
    title: string
    minimum_approve_questions: number
    total_questions: number
    sucessfullQuestion: number 
    sections: string[]
}

interface Option  {
    _id: string
    text: string
    answer: boolean
    isChecked: boolean
}

interface Question  {
    _id: string
    question: string
    options: Option[]
    stSendComplete: boolean
}

interface QuestionData  {
    _id: string
    idCourse: string
    title: string
    questions: Question[]
}

interface QuestionResponse  {
    data: QuestionData
}

interface SectionInforamtion  {
    idSection: string
    sectionName: string
    stFinishSection: boolean
    questions: Question[]
}

interface ExamInformation  {
    idExam: string
    idCourse: string
    examTitle: string
    minimum_approve_questions: number
    stFinishExam: boolean
    sections: SectionInforamtion[]
    calification: string
}

interface ExamsResp  {
    exams: ExamInformation[]
}

interface Result {
    result_id: string  
}

interface InitResponse {
    code:number,
    status: string,
    additional_information: Result
}

interface QuestionRequest {
    question: string,
    selected_option:string,   
}

interface CalificationData {
    data: CalificationList
}

interface CalificationList {
    califications: Calification[]
}

interface Calification {
    _id: string
    successfull_answers: number
    exam: Exam
}

interface Exam {
    total_questions: number
}

const useCallExamsService = (): [
    ExamsResp | undefined, 
    JSX.Element, 
    (idCourse: string) => Promise<void>, 
    (idCourse: string) => void,
    (idExam: string, idQuestion: string, idOption: string, Questions: Question[], idCourse: string, idSection: string ) => Promise<void>
] => {
    
    const [token, generate, deleteToken] = useToken();
    const [examStorage, setExamOperation, resultIdStore, getResultId] = useStorageExam();
    const [spinner, setActive] = useSpinner();
    const [inforamtion, setInformation] = useState<ExamsResp | undefined>(undefined);
    
    useEffect(() =>{
        generate()
    },[token])

    const getInformationExam = async(req: Props) => {
        let examResponse: ExamResponse = await getExams(req);
        
        if(examResponse.data.length > 0) {
           let examResponseData: ExamData[] = examResponse.data;
           let examInforamtion: ExamInformation[] = []
           let sectionsQuestions:SectionInforamtion[] = []
           for(let exam of examResponseData){
               let sections = exam.sections;
               for(let sectionId of sections){
                let sectionInfo: QuestionResponse | undefined =  await getQuestion(sectionId, req.token);
                let nameSection: string = sectionInfo?.data.title ?? "";
                if(sectionInfo !== undefined){
                    let questions: Question[] = sectionInfo!.data.questions
                        .map((quest) => {
                            let { _id, options, question} = quest
                            let opt: Option[] = options.map((o) => ({_id: o._id, text: o.text, answer: o.answer, isChecked: false}));
                            return {_id: _id, question: question, options: opt, stSendComplete: false};
                        });
                    sectionsQuestions.push({ idSection: sectionId, sectionName: nameSection, questions: questions, stFinishSection: false});   
                } else {
                    sectionsQuestions.push( {idSection: sectionId, sectionName: nameSection, questions: [], stFinishSection: false});
                }
               }
               await startExam(exam._id);
               examInforamtion.push({
                idExam: exam._id,
                idCourse: req.idCourse, 
                examTitle: exam.title,
                minimum_approve_questions: exam.minimum_approve_questions, 
                sections: sectionsQuestions,
                stFinishExam: false,
                calification: ""
            })
           }
           const rsp = {exams: examInforamtion}
           setExamOperation({
             idCourse: req.idCourse,
             action: Actions.UPDATE,
             examsOfCourse: rsp
            }).then(() =>{
                setInformation(rsp);
            })
            .catch((e) =>{
                    console.log("Fallo Almacenando la inforamción de los examenes %o", e)
            });
        }
    }
    
    const getExams = (req: Props):Promise<ExamResponse> => {
        const uri = `/api/courses/v1/${req.idCourse}/exams`;
        return HttpClient.get<ExamResponse>(
            uri,
            { headers: { authorization: `bearer ${req.token}` }})
        .then((res) => {
            const data: ExamData[] = res.data.data!.map(exam => ({...exam, idCourse: req.idCourse, sucessfullQuestion: 0}))
            return {data: data}
        }).catch((e)=> {
            console.log("Algo salio mal al obtener el examen", e);
            return { data: [] }
        } )
    }
    
    const getQuestion = (idSection: string, token: string): Promise<QuestionResponse | undefined> => {
        const uri = `/api/section/v1/${idSection}/find`;
        return HttpClient.get<QuestionResponse>(
            uri,
            { headers: { authorization: `bearer ${token}` } })
            .then((res) => {
                return res.data;
            })
            .catch((e) => {
                console.log("Algo salio mal al cosnusalta las preguntas", e);
                return undefined;
            })
    }

    const callApi = async (idCourse: string) => {
        setActive(true);
        await getInformationExam({token, idCourse});
        setActive(false);
    }

    const getInforamtion = (idCourse: string) => {
        setActive(true);
       setExamOperation({
            idCourse: idCourse,
            action: Actions.SELECT,
            examsOfCourse: undefined
        }).then(async (data) => {
            if(data === undefined || data === null){
                await callApi(idCourse);
                setActive(false);
            } else {
                setInformation(data);
                setActive(false);
            }
        })     
    }

    const startExam = async (idExam: string) => {
            const uri = `/api/exam/v1/${idExam}/init`;
            let res: InitResponse | undefined = undefined; 
            try{
            let { data } = await HttpClient.request<InitResponse>({
                url: uri,
                method: "post",
                headers: {
                    authorization: `bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            res = data;
        } catch(e: any){
            console.log("No se pudo almacenar el inicio del examen", e);
        }

        if(res !== null || res !== undefined) {
            console.log("RES", res)
            console.log("Start SAVE SB")
            setExamOperation({
                idCourse: idExam,
                action: Actions.UPDATE,
                examsOfCourse: res?.additional_information.result_id
               }).then(() => {console.log("TODO BIEN")})
               .catch((e: any) =>{
                    console.log("Fallo Almacenando la inforamción del inicio del examen %o", e)
               });
        }
    }
    
    const finishExam = async (idExam: string) => {
        getResultId(idExam).then((res) => {
            const uri = `/api/calification/v1/${res}/finish`;
            HttpClient.put<any>(
                uri,
                {},
                {headers: {
                    authorization: `bearer ${token}`,
                    'Content-Type': 'application/json'
                }}
            ).then(() =>{

            }).catch((e: any) =>{
                console.log("No se pudo almacenar la calificación", e);
            })
        })
}

    const sendQuestion = async (idExam: string, idQuestion: string, idOption: string, Questions: Question[], idCourse: string, idSection: string ) => {
        
        getResultId(idExam).then((res) => {
            console.log(idExam)
            console.log("holi");
            console.log(resultIdStore)
            const uri = `/api/calification/v1/${res}/question`;
        
                const req: QuestionRequest = {
                    question: idQuestion,
                    selected_option: idOption
                }
                HttpClient.post<any>(
                    uri,
                    req,
                    {headers: {
                        authorization: `bearer ${token}`,
                        'Content-Type': 'application/json'
                    }}
                ).then(async () => {
                    const copyInforamtion: ExamsResp = JSON.parse(JSON.stringify(inforamtion)) as ExamsResp;
                    const updateCopyExams = copyInforamtion.exams
                .map(exams => {
                    if(exams.idExam === idExam){
                        exams.sections.map( sec => {
                                if(sec.idSection === idSection){
                                    sec.questions = Questions;
                                }
                                return sec;
                            }
                        )
                        return exams;
                    }
                    return exams;
                } 
                )
            
            if(Questions.filter(q => !q.stSendComplete).length === 0) {
                finishExam(idExam).then(() =>{
                    console.log("Finish exam")
                }).catch((e) =>{
                    console.log("Algo salio mal")
                })
                await getCalification(idCourse, idExam).then((res)=> {
                    console.log("res", res)
                    copyInforamtion.exams.filter(exam => exam.idExam = idExam)[0].calification = res;
                })
                copyInforamtion.exams.filter(exam => exam.idExam = idExam)[0].stFinishExam = true
               
            }
              
            copyInforamtion.exams = updateCopyExams;
            setExamOperation({
                idCourse: idCourse,
                action: Actions.UPDATE,
                examsOfCourse: copyInforamtion
               }).then(() =>{
                   setInformation(copyInforamtion);
               })
               .catch((e) =>{
                    console.log("Fallo Actualizando la inforamción de los examenes %o", e)
               });
    
            } ).catch((e: any) => {
                console.log("No se pudo almacenar la calificación", e);
            });
        })
      
    }

    const getCalification = (idCourse:string, examId: string): Promise<string> => {
        return getResultId(examId).then((result) => {
            return HttpClient.get<CalificationData>(
                `/api/calification/v1/${idCourse}/results`,
                { headers: { authorization: `bearer ${token}` }})
                .then((res) => {
                    const data = res.data.data.califications.filter(ca => ca._id === result)
                    return `${data[0].successfull_answers}/${data[0].exam.total_questions}`
                })
        }).catch((e: any) =>{
            return ""
        })
    }

    return [inforamtion, spinner, callApi, getInforamtion, sendQuestion]

}


export default useCallExamsService;

export type { 
    ExamData, 
    ExamsResp, 
    ExamInformation, 
    SectionInforamtion, 
    ExamResponse, 
    Question,
    Option
}