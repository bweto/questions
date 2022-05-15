import React, { Fragment } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { readerOutline, refreshCircleSharp } from 'ionicons/icons';
import { ItemResponse, ListInforamtionResponse } from '../../service/CourseClient';

const List: React.FC<ListInforamtionResponse> = (list: ListInforamtionResponse) => {
    const createItem = (item: ItemResponse) => (
        <IonItem
            key={item.key}
            button
            detail
            routerLink={`${item.basePath}/${item.id}`}
        >
            <IonIcon size="large" slot="start" icon={readerOutline} />
            <IonLabel>{item.label}</IonLabel>
        </IonItem>
    );

    return (
        <Fragment>
            <IonListHeader>
                <IonLabel></IonLabel>
                <IonButton onClick={list.refresh!}>
                    <IonIcon slot="icon-only" icon={refreshCircleSharp} />
                </IonButton>
            </IonListHeader>
            <IonList lines="full">
                {list.items.map(
                    item => createItem(item)
                )}
            </IonList>
        </Fragment>
    );
}
export default List;