import HttpClient from "./HttpClient";

interface Props {
    token: string,
    idCourse: string
}
class SectionResponse {
    constructor(data: SectionData[], refresh: () => void) {
        this.data = data;
        this.refresh = refresh;
    }
    data: SectionData[]
    refresh: () => void
}
class SectionData {
    constructor(
        id: string,
        title: string,
        type: number,
        questions_count: number
    ){
        this._id = id;
        this.title = title;
        this.type = type;
        this.questions_count = questions_count
        this.basePath = "/section"
    }
    _id: string
    title: string
    type: number
    questions_count: number
    basePath: string
}

const getSection = (req: Props):Promise<SectionResponse | undefined> => {
    const uri = `/api/courses/v1/${req.idCourse}/sections`;
    return HttpClient.get<SectionResponse>(
        uri,
        { headers: { authorization: `bearer ${req.token}` }})
    .then((res) => {
    return  res.data;
    })
    .catch((e)=> undefined)
}

export { getSection }
export { SectionResponse,  SectionData} 