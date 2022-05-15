import React, { useCallback, useEffect } from 'react';
import { 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonPage, 
    IonHeader, 
    useIonToast, 
    IonButtons, 
    IonBackButton 
} from '@ionic/react';

import { NotFound } from '../../components/notFound/NotFound';
import { useParams } from 'react-router';
import ListExam from './List';
import useCallExamsService from '../../service/Exams';

type ExamParams = {
    id: string
}

const Exams: React.FC = () => {

    const [present, dismiss] = useIonToast();
    const { id } = useParams<ExamParams>();   
    const [inforamtion, spinner, callApi, getInforamtion] = useCallExamsService();

    const fetchData = useCallback(() => {
        callApi(id).then(() =>{})
        if (inforamtion === undefined) {
            present("No hay secciones disponibles", 1000)          
        }  
    }, [inforamtion])

    useEffect(() => {
        getInforamtion(id);
    }, [])

    const isActiveCourse = () => {
        const size = inforamtion?.exams?.length ?? 0
        return size > 0 ? <ListExam examsResp={inforamtion!} refresh={fetchData} />
            : <NotFound
                message="No hay examenes resgistrados"
                refresh={fetchData}
                spinner={spinner}
            />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="home" />
                    </IonButtons>
                    <IonTitle>Examenes</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {isActiveCourse()}
            </IonContent>
        </IonPage>
    );
};

export default Exams;
