import React, { useEffect } from 'react';
import { 
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonHeader,
    IonButtons,
    IonBackButton
} from '@ionic/react';
import { NotFound } from '../../components/notFound/NotFound';
import { useParams } from 'react-router';
import ListQuestion from './List';
import useCallExamsService from '../../service/Exams';

type Params = {
    idCourse: string
    idExam: string
    idSection: string
}

const QuestionPage: React.FC = () => {

    const [ inforamtion, spinner, callApi, getInforamtion, sendQuestion ] = useCallExamsService();
    const { idCourse, idExam, idSection } = useParams<Params>()

    useEffect(() => {
        getInforamtion(idCourse);
    }, [])

   
    const isActiveCourse = () => {
        const exams = inforamtion?.exams
            .filter(exam => exam.idExam === idExam);
        
        const section = exams?.flatMap(exam => {
            const section = exam.sections.filter(section => section.idSection === idSection);
            return section
        });

        const questions = section?.flatMap(section => section.questions);

        return (questions?.length ?? 0) > 0 ? 
            <ListQuestion 
                questions={questions!} 
                idCourse={idCourse}
                idExam={idExam}
                idSection={idSection}
                information={inforamtion!}
                onSendQuestion={sendQuestion}
            />
            : <NotFound
                message="No hay preguntas resgistradas"
                refresh={undefined}
                spinner={spinner}
            />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Preguntas</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {isActiveCourse()}
            
            </IonContent>
        </IonPage>
    );
};

export default QuestionPage;