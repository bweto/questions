
import { ItemResponse, ListInforamtionResponse } from "./CourseClient";
import HttpClient from "./HttpClient";

interface Props {
    token: string,
    idCourse: string
}
interface ExamResponse {
    data: ExamData[]
}
interface ExamData {
    _id: string
    title: string
    minimum_approve_questions: number
    total_questions: number
    sections: string[]
}

const getExams = (req: Props):Promise<ListInforamtionResponse | undefined> => {
    const uri = `/api/courses/v1/${req.idCourse}/sections`;
    return HttpClient.get<ExamResponse>(
        uri,
        { headers: { authorization: `bearer ${req.token}` }})
    .then((res) => {
    return examToListInformation(res.data.data)
    })
    .catch((e)=> undefined)
}

const examToItem = (examData: ExamData): ItemResponse => {
    return {
        icon: "",
        label: examData.title,
        key: examData._id,
        id: examData._id,
        basePath: "/section",
    };
}

const examToListInformation = (examsData: ExamData[]): ListInforamtionResponse => {
    return { items: examsData.map(exam => examToItem(exam))}
}


export default getExams