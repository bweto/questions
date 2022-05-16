import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";

import { exitOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import useStorage, { Actions, StorageVar } from "../../hooks/useStorage";
import { logout } from "../../service/AuthClient"
import { getCourse, ListInforamtionResponse } from "../../service/CourseClient";
import { NotFound } from "../../components/notFound/NotFound";
import useSpinner from "../../hooks/useSpinner";
import { Inscription } from "../inscription/Inscription";
import List from "./List";
import useToken from '../../hooks/useToken';


const COURSE_ACTIVE = "ACTIVE";
const COURSE_ENROLL = "ENROLL";

const Course: React.FC = () => {
  const [token, generate, deleteToken] = useToken();
  const history = useHistory();
  const [attribute, storageAction] = useStorage();
  const [segment, setSegment] = useState<string | undefined>(COURSE_ACTIVE);
  const [courses, setCourses] = useState<ListInforamtionResponse>({ items: [] });
  const [isEmptyToken, setIsEmptyToken] = useState<boolean>(true)
  const [spinner, setActive] = useSpinner()
  const [present, dismiss] = useIonToast();

  const fetchData = useCallback(() => {

    const fetch = async () => {
      setActive(true)
      let data = await getCourse(token)
      setActive(false)
      if (data) {
        setCourses(data!)
      }
      else { present("No hay cusros disponibles", 1000) }
    }
    fetch()
  }, [token])

  useEffect(() => {
    generate();
    if (token && isEmptyToken) {
      fetchData()
      setIsEmptyToken(false)
    }
  }, [token, isEmptyToken])

  const close = () => {
    logout(token).then(() => {
      storageAction({
        name: StorageVar.TOKEN,
        action: Actions.DELETE,
      })
      deleteToken();
      history.push("/login");
    })
  };

  const isActiveCourse = () => {
    if (segment === COURSE_ACTIVE) {
      return courses.items.length > 0 ? <List items={courses.items} refresh={fetchData} />
        : <NotFound
          message="No hay cursos resgistrados"
          refresh={fetchData}
          spinner={spinner}
        />
    }
    return <Inscription callActiveCourse={() => { setSegment(COURSE_ACTIVE) }} />
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={close}>
              <IonIcon slot="icon-only" icon={exitOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Cursos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonSegment
                onIonChange={(e) => setSegment(e.detail.value)}
                value={segment}
                defaultValue={COURSE_ACTIVE}
                className="ion-padding"
              >
                <IonSegmentButton value={COURSE_ACTIVE}>
                  <IonLabel>Activos</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value={COURSE_ENROLL}>
                  <IonLabel>Inscribir</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              {isActiveCourse()}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Course;
