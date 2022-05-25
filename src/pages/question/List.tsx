import React, { useState, useEffect } from 'react';
import { 
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonText,
    useIonModal,
    useIonToast 
    } from '@ionic/react';
import { readerOutline } from 'ionicons/icons';
import QuestionModal from './question_modal';
import { ExamsResp, Question } from '../../service/Exams';

interface Props {
    questions: Question[],
    idSection: string,
    idCourse: string,
    idExam: string,
    information: ExamsResp,
    onSendQuestion: (idExam: string, idQuestion: string, idOption: string, inforamtion: Question[], idCourse: string, idSection: string ) => Promise<void>, 
}

const ListQuestion: React.FC<Props> = (props: Props) => {

    const [item, setItem] = useState<Question>()
    const [toast, exitToast] = useIonToast();
    const [questionsState, setQuestionState] = useState<Question[]>([]);

    useEffect(()=>{
        setQuestionState(props.questions);
    },[])

    const handlerDismiss = () => {
        dismiss()
    }

    const onSendAnswer = async (answerId: string, questionId: string) => {
        
        const questionsCopy = JSON.parse(JSON.stringify(questionsState)) as Question[];
        const optionCopy = questionsCopy
            .filter(q => q._id === questionId)
            .flatMap(o => o.options);
        const updateOption = optionCopy
            .map(opt => {
                if(opt._id === answerId){
                   opt.isChecked = true 
                }
                return opt;
            }) 
        const updateQuestion = questionsCopy
            .map(question => {
                if(question._id === questionId){
                    question.options = updateOption;
                    question.stSendComplete = true;
                }
                return question;
            })
        
        const copyInforamtion: ExamsResp = JSON.parse(JSON.stringify(props.information)) as ExamsResp;

        const updateCopyExams = copyInforamtion.exams
            .map(exams => {
                if(exams.idExam === props.idExam){
                    exams.sections.map( sec => {
                            if(sec.idSection === props.idSection){
                                sec.questions = updateQuestion;
                            }
                            return sec;
                        }
                    )
                    return exams;
                }
                return exams;
            } 
            )
        copyInforamtion.exams = updateCopyExams;
        
        props.onSendQuestion(
            props.idExam,
            questionId,
            answerId,
            updateQuestion,
            props.idCourse,
            props.idSection
            ).then(()=>{
                setQuestionState(updateQuestion);
                toast("Se almaceno la respuesta", 2000);
            })
            .catch((e) => {
                toast("Trata de nuevo enviar la respuesta", 2000);
                console.log("Algo salio mal en la lista");
            })
        
    }

    const [present, dismiss] = useIonModal(QuestionModal, {
        questionInfo: item,
        idSection: props.idSection,
        idCourse: props.idCourse,
        idExam: props.idExam, 
        onDismiss: handlerDismiss,
        onSendAnswer: onSendAnswer
    })

    
    const createItem = (item: Question) => (
        <IonItem 
            key={item._id} 
            button 
            detail 
            onClick={(e) => {
                if(item.stSendComplete){
                    toast("Ya contestates la pregunta", 1000);
                } else {
                    setItem(item);
                    present({ 
                        backdropDismiss: true,

                    });
                }
            }}
        >
            <IonIcon 
                size="large" 
                slot="start" 
                icon={readerOutline} 
            />
            <IonLabel>
                {item.question}
            </IonLabel>
        </IonItem>
    );

    return (
            <IonList lines="full">
                {questionsState.map(question => createItem(question))}
            </IonList>
);

}
export default ListQuestion;