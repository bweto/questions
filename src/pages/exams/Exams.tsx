import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IonToolbar, IonTitle, IonContent, IonPage, IonSegment, IonHeader, useIonToast, IonButtons, IonBackButton } from '@ionic/react';
import { ListInforamtionResponse } from '../../service/CourseClient';
import List from '../../components/list/list';
import { NotFound } from '../../components/notFound/NotFound';
import { TokenContext } from '../../hooks/useTokenContext';
import useSpinner from '../../hooks/useSpinner';
import { useHistory } from 'react-router';
import getExams from '../../service/Exams';

const Exams: React.FC = () => {
    let { token, setToken } = useContext(TokenContext);
    const [exams, setExams] = useState<ListInforamtionResponse>({ items: [] })
    const [spinner, setActive] = useSpinner()
    const history = useHistory();
    const [present, dismiss] = useIonToast();
    const [isEmptyToken, setIsEmptyToken] = useState<boolean>(true)

    const fetchData = useCallback(() => {
        const fetch = async () => {
            setActive(true)
            const data = await getExams({token, idCourse: history.location.pathname.split("/")[2]})
            setActive(false)
            if (data) {
                setExams(data!)
            }
            else { present("No hay secciones disponibles", 1000) }
        }
        fetch()
    }, [token])

    useEffect(() => {
        if (token && isEmptyToken) {
            fetchData()
            setIsEmptyToken(false)
        }
    }, [token, isEmptyToken])

    const isActiveCourse = () => {
        return exams.items.length > 0 ? <List items={exams.items} refresh={fetchData} />
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
                        <IonBackButton defaultHref="/" />
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