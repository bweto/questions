import React, { Fragment } from 'react';
import { IonButton, IonIcon, IonLabel, IonList, IonListHeader } from '@ionic/react';
import Item from '../item/item';
import { ListInforamtionResponse } from '../../service/CourseClient';
import { refreshCircleSharp } from 'ionicons/icons';

const List: React.FC<ListInforamtionResponse> = (list: ListInforamtionResponse) => (
    <Fragment>
        <IonListHeader>
        <IonLabel></IonLabel>
        <IonButton onClick={ list.refresh! }>
          <IonIcon slot="icon-only" icon={refreshCircleSharp} />
        </IonButton>
        </IonListHeader>
        <IonList lines="full">
            {list.items.map(
                item => <Item
                    key={item.key}
                    label={item.label}
                    icon={item.icon}
                    id={item.id}
                    basePath={item.basePath}
                />
            )}
        </IonList>
    </Fragment>
);

export default List;
