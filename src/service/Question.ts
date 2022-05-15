import HttpClient from "./HttpClient";

interface Props {
    token: string,
    idSection: string
}
class QuestionResponse {
    constructor(data: QuestionData, refresh: () => void) {
        this.data = data;
        this.refresh = refresh;
    }
    data: QuestionData
    refresh: () => void
}

interface Option {
    _id: string
    text: string
    answer: boolean
    isChecked: boolean
}

class Question {
    constructor(
        _id: string,
        question: string,
        options: Option[],
    ){
        this._id = _id;
        this.question = question;
        this.options = options;
        this.isChecked = false;
    }
    _id: string
    question: string
    options: Option[]
    isChecked: boolean
}

class QuestionData {
    constructor(
        id: string,
        idCourse: string,
        questions: Question[]
    ) {
        this._id = id;
        this.idCourse = idCourse;
        this.questions = questions;
    }
    _id: string
    idCourse: string
    questions: Question[]
}


const getQuestion = (req: Props): Promise<QuestionResponse | undefined> => {
    const uri = `/api/section/v1/${req.idSection}/find`;
    return HttpClient.get<QuestionResponse>(
        uri,
        { headers: { authorization: `bearer ${req.token}` } })
        .then((res) => {
            return res.data;
        })
        .catch((e) => undefined)
}

export { getQuestion, QuestionData, QuestionResponse }

export type { Question, Option }
