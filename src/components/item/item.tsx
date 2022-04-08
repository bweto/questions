import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { readerOutline } from "ionicons/icons";
import React from "react";
import { ItemResponse } from "../../service/CourseClient";

const Item: React.FC<ItemResponse> = (item: ItemResponse) => {
    return (
        <IonItem button>
            <IonIcon size="large" slot="start" icon={readerOutline} />
            <IonLabel>{item.label}</IonLabel>
        </IonItem>
    )

}

export default Item;
