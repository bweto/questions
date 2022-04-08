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
    IonText
} from '@ionic/react';
import { TokenContext } from '../../hooks/useTokenContext';
import { useHistory } from 'react-router-dom';


export const Inscription: React.FC = () => {

    const { token, setToken } = useContext(TokenContext);
    const history = useHistory();
    const [active, setActive] = useState<boolean>(true);
    const [id,  setId] = useState<string | null | undefined>("");
    const [pass, setPass] = useState<string | null | undefined>("");

    const handlerInscription = (e: React.SyntheticEvent) => {
        e.preventDefault();
 
      };

    return (
        <IonPage>
            <IonContent>
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
                                                onIonChange={e => {setId(e.detail.value)}}
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
                                                onIonChange={e => {setPass(e.detail.value)}}
                                            />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="12">
                                        <IonText color="danger">
                                            {//<p>{password.errorMSG}</p>
                                            }
                                        </IonText>
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
