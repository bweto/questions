import React, { Fragment } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { readerOutline, refreshCircleSharp } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { ExamInformation, ExamsResp } from '../../service/Exams';

interface Props {
    examsResp: ExamsResp, 
    refresh: () => void
}

const ListExam: React.FC<Props> = ({ examsResp , refresh }) => {
    const history = useHistory()

    const createItem = (item: ExamInformation) => (
        <IonItem key={item.idExam} button detail onClick={(e) => {
            history.push(`/section/${item.idCourse}/${item.idExam}`)
        }}>
            <IonIcon size="large" slot="start" icon={readerOutline} />
            <IonLabel>{item.examTitle}</IonLabel>
        </IonItem>
    );

    return (
        <Fragment>
            <IonListHeader>
                <IonLabel></IonLabel>
                <IonButton onClick={refresh!}>
                    <IonIcon slot="icon-only" icon={refreshCircleSharp} />
                </IonButton>
            </IonListHeader>
            <IonList lines="full">
                {examsResp.exams?.map(item => createItem(item))}
            </IonList>
        </Fragment>
);

}
export default ListExam;