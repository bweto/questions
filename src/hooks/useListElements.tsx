import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList } from "@ionic/react";
import React, { Fragment, useEffect, useState } from "react";
import { readerOutline } from "ionicons/icons";
import { ListInforamtionResponse } from "../service/CourseClient";

const useListElements = (data: ListInforamtionResponse) => {

    const elemets = () => (<IonList lines="full">
        {data.items.map(
            item => <IonItemSliding>
                <IonItem button >
                    <IonIcon size="large" slot="start" icon={readerOutline} />
                    <IonLabel>{item.label}</IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => { }}>Borrar</IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        )}
    </IonList>)

    return [elemets]

}

export default useListElements