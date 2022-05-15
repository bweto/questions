import React from 'react';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { readerOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { ExamsResp, SectionInforamtion } from '../../service/Exams';

type Props = {
    idCourse: string
    idExam: string
    examResp: ExamsResp
}

const ListSection: React.FC<Props> = ({ idCourse, idExam, examResp }) => {
    const history = useHistory()

    const createItem = (item: SectionInforamtion) => {
      
        return (<IonItem key={item.idSection} button detail onClick={(e) => {
            history.push(`/question/${idCourse}/${idExam}/${item.idSection}`)
        }}>
            <IonIcon size="large" slot="start" icon={readerOutline} />
            <IonLabel>{item.sectionName}</IonLabel>
        </IonItem>);
    }

    return (
        <IonList lines="full">
                {(examResp.exams!)
                .filter(exam => exam.idExam === idExam)
                .flatMap(ex => ex.sections)
                .map(item => createItem(item))}
        </IonList>
    );

}
export default ListSection;