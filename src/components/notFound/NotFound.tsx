import { IonButton, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { refresh } from 'ionicons/icons';
import "./NotFound.css"

interface NotFoundData {
    message: string,
    refresh?: () => void | undefined
    spinner: JSX.Element
}

export const NotFound: React.FC<NotFoundData> = (props: NotFoundData) => {
    return (<div className="center  max-size">
        {props.spinner}
        <IonGrid>
            <IonRow>
                <IonCol className='center'size="12">
                    <IonText>
                        <h3>{props.message}</h3>
                    </IonText>
                </IonCol>
            </IonRow>
            { refresh === undefined? null : <IonRow>
                <IonCol size="12">
                    <IonButton
                        expand="block"
                        fill="clear"
                        onClick={props.refresh}
                    >Consultar de nuevo</IonButton>
                </IonCol>
            </IonRow>
            }
        </IonGrid>
    </div>)
};