import React, { useState, useEffect } from 'react';
import { 
    IonCard, 
    IonCardHeader, 
    IonCheckbox, 
    IonItemDivider, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonCardContent, 
    IonButton, 
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
} from '@ionic/react';

import { CheckboxChangeEventDetail } from '@ionic/core';
import { Question, Option } from '../../service/Exams';
import { IonPage } from '@ionic/react';


interface Modal {
    questionInfo: Question,
    idSection: string,
    idCourse: string,
    idExam: string,
    onDismiss: () => void,
    onSendAnswer: (answerId: string, questionId: String) => Promise<void>,
}

const QuestionModal: React.FC<Modal> = ({questionInfo, idSection, idCourse, idExam, onDismiss, onSendAnswer}) => {

    const [isActive, setActive] = useState<boolean>(false);
    const [isActiveBtn, setActiveBtn] = useState<boolean>(true);
    const [optionsState, setOptionsState] = useState<Option[]>([]);
    const [isQuestionComplete, setQuestionComplete] = useState<boolean>(false);
    const handlerActiveButton = (event: CustomEvent<CheckboxChangeEventDetail<Option>>, opt: Option) => {
        
        const update = JSON.parse(JSON.stringify(optionsState)) as Option[]; 
        const changes = update.map(optState => {
            if(optState._id === opt._id){
                optState.isChecked = opt.isChecked? false : true;
            }
            return optState;
        })
        setOptionsState([...changes])
        isActive? setActive(false) : setActive(true);
    }

    useEffect(()=>{
        setOptionsState(questionInfo.options);
        const isSendQuestion = questionInfo.options.filter(q => q.isChecked).length;
        if(isSendQuestion === 1) {
            setQuestionComplete(true);
        }
    },[])

    useEffect(() =>{
        const optSelect = optionsState.filter(opt => opt.isChecked).length;
        if(optSelect === 1) {
            setActiveBtn(false);
        } else {
            setActiveBtn(true);
        }
    }, [optionsState, setOptionsState])

    const handlerClick =  () => {
        const answer = optionsState.filter(opt => opt.isChecked)[0];
        onSendAnswer(answer._id, questionInfo._id).then(() => {
            onDismiss();
        }).catch((err: any) => {
            console.log("Algo salio mal al enviar la respuesta");
        });
        
    }

    const handlerActiveBtn = () =>{
        if(isQuestionComplete){
            return true;
        }
        return isActiveBtn;
    }

    return (
                <IonPage>
                     <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`question/${idCourse}/${idExam}/${idSection}`} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
                    <IonContent fullscreen>
                    <IonCard>
                        <IonCardHeader>
                            <IonLabel className="ion-text-wrap">
                                {questionInfo.question}
                            </IonLabel>
                        </IonCardHeader>
                        <IonItemDivider></IonItemDivider>
                        <IonCardContent>
                        <IonList>
                            {
                                optionsState.map((opt, i) => {
                                    return<IonItem key={i}>
                                        <IonLabel>{opt.text}</IonLabel>
                                        <IonCheckbox 
                                            mode = "ios"
                                            slot='end' 
                                            value={opt.text}
                                            checked={opt.isChecked}
                                            onIonChange={(e) => {handlerActiveButton(e, opt)}}
                                        />
                                    </IonItem>
                                })
                            }
                            </IonList>
                            <IonButton 
                                shape="round" 
                                expand='full'
                                onClick={handlerClick}
                                disabled={handlerActiveBtn()}
                            >
                                Enviar respuesta
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                    </IonContent>
                </IonPage>
                     
    );
};

export default QuestionModal;