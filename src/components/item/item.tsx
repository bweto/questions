import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { readerOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { ItemResponse } from "../../service/CourseClient";

const Item: React.FC<ItemResponse> = (item: ItemResponse) => {
    const history = useHistory();

    return (
        <IonItem button detail onClick={(e)=> {
            e.preventDefault();
            history.push(`${item.basePath}/${item.id}`)
        }}>
            <IonIcon size="large" slot="start" icon={readerOutline} />
            <IonLabel>{item.label}</IonLabel>
        </IonItem>
    )

}

export default Item;
