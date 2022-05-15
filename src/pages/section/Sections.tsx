import React, { useEffect } from 'react';
import { 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonPage, 
    IonHeader, 
    IonButtons, 
    IonBackButton } from '@ionic/react';
import { NotFound } from '../../components/notFound/NotFound';
import { useParams } from 'react-router';
import ListSection from './List';
import useCallExamsService from '../../service/Exams';

type SectionParams = {
    idCourse: string
    idExam: string
}

const Section: React.FC = () => {
    
    const { idCourse, idExam } = useParams<SectionParams>();
    const [inforamtion, spinner, callApi, getInforamtion] = useCallExamsService();

    useEffect(() => {
        getInforamtion(idCourse);
    }, [])

    const isActiveCourse = () => {
    const exam = inforamtion?.exams.filter(exam => exam.idExam === idExam);
    
       return exam !== undefined && exam[0].sections.length > 0 ? 
                <ListSection idCourse={idCourse} idExam={idExam} examResp={inforamtion!}/> :
                <NotFound
                    message="No hay secciones resgistradas"
                    refresh={undefined}
                    spinner={spinner}
                />
  ;}

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="home" />
                    </IonButtons>
                    <IonTitle>Secciones</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {isActiveCourse()}
            </IonContent>
        </IonPage>
    );
};

export default Section;