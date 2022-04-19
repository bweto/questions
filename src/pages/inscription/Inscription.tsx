import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonText,
    useIonToast
} from '@ionic/react';
import { TokenContext } from '../../hooks/useTokenContext';
import { useHistory } from 'react-router-dom';
import { InputChangeEventDetail } from '@ionic/core';
import { startInscription } from '../../service/Inscription';
import useSpinner from '../../hooks/useSpinner';

interface Props {
    callActiveCourse: () => void
}

export const Inscription: React.FC<Props> = ({ callActiveCourse }) => {

    const { token, setToken } = useContext(TokenContext);
    const history = useHistory();
    const [active, setActive] = useState<boolean>(true);
    const [id, setId] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [spinner, setSpinner] = useSpinner()
    const [present, dismiss] = useIonToast();

    const handlerInscription = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setSpinner(true);
        startInscription({
            idCourse: id,
            code: pass,
            token: token
        }).then(res => {
            if (res) {
                setSpinner(false)
                present({
                    color: "success",
                    message: "Registro completo.",
                    duration: 1200,
                    position: "top"
                })
                callActiveCourse()
            } else {
                setSpinner(false)
                present("No fue posible hacer el registro.", 1200)
            }
        })
    };


    useLayoutEffect(() => {
        id !== "" && pass !== "" ? setActive(false) : setActive(true);
    }, [id, pass])

    const handlerId = (e: CustomEvent<InputChangeEventDetail>) => {
        setId(e.detail.value ?? "")
    }

    const handlerPass = (e: CustomEvent<InputChangeEventDetail>) => {
        setPass(e.detail.value ?? "")
    }

    return (
        <IonPage>
            <IonContent>
                {spinner}
                <IonCard>
                    <IonCardHeader>
                        <IonCardSubtitle>Incripción de cursos</IonCardSubtitle>
                        <IonCardTitle>¿Cómo inscribir un curso?</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        Para incribir un curso ingresa el id y contraseña proporcionados por el profesor.
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <form className="ion-padding" onSubmit={handlerInscription} name="formLogin">
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="12">
                                        <IonItem>
                                            <IonLabel position="floating">ID curso</IonLabel>
                                            <IonInput
                                                name="curso"
                                                type="text"
                                                value={id}
                                                inputMode="text"
                                                autofocus
                                                clearInput
                                                onIonChange={handlerId}
                                            />
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="12">
                                        <IonItem>
                                            <IonLabel position="floating">Contraseña</IonLabel>
                                            <IonInput
                                                name="password"
                                                type="password"
                                                value={pass}
                                                inputMode="text"
                                                clearInput
                                                onIonChange={handlerPass}
                                            />
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="12">
                                        <IonButton
                                            expand="full"
                                            shape="round"
                                            type="submit"
                                            disabled={active}
                                        >
                                            Incribir curso
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </form>
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    );
};
