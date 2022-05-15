import { InputChangeEventDetail } from "@ionic/core";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  useIonAlert,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import Spinner from "../../components/spinner/spinner";
import "./Login.css";
import { login } from "../../service/AuthClient";
import useStorage, { Actions, StorageVar } from "../../hooks/useStorage";
import { TokenContext } from "../../hooks/useTokenContext";

interface Validation {
  value: string;
  errorMSG: string;
  isValid: boolean;
}

const patternEmail =
  /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(konradlorenz)\.edu\.co$/;

const Login: React.FC = () => {
  const { token, setToken } = useContext(TokenContext);

  const [attribute, storageAction] = useStorage();

  const [present] = useIonAlert();

  const history = useHistory();

  const [email, setEmail] = useState<Validation>({
    value: "",
    errorMSG: "",
    isValid: false,
  });

  const [password, setPassword] = useState<Validation>({
    value: "",
    errorMSG: "",
    isValid: false,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [active, setActive] = useState<boolean>(true);

  const isActiveButton = () => {
    email.isValid && password.isValid ? setActive(false) : setActive(true);
  };

  const handlerOnChangeEmail = (e: CustomEvent<InputChangeEventDetail>) => {
    let emailValue = e.detail.value!;
    if (!patternEmail.test(emailValue) || emailValue === "") {
      setEmail({
        ...email,
        value: emailValue,
        errorMSG: "Ejemplo@konradlorenz.edu.co",
      });
      setActive(true);
      return;
    }

    setEmail({
      ...email,
      value: emailValue,
      errorMSG: "",
      isValid: true,
    });
    isActiveButton();
  };

  const handlerOnChangePassword = (e: CustomEvent<InputChangeEventDetail>) => {
    let passwordValue = e.detail?.value || "";
    if (!passwordValue) {
      setPassword({
        ...password,
        value: passwordValue,
        errorMSG: "No puede ser vacio",
      });
      setActive(true);
      return;
    }

    setPassword({
      ...password,
      value: passwordValue,
      errorMSG: "",
      isValid: true,
    });
    isActiveButton();
  };

  useEffect(() => {
    const callLogin = () => {
      login({ email: email.value, password: password.value })
        .then((res) => {
          const { bearer, data } = res.data;
          setToken(bearer);
          storageAction({
            name: StorageVar.PERMISSIONS,
            value: data.permissions,
            action: Actions.INSERT,
          });
          storageAction({
            name: StorageVar.LAST_LOGIN,
            value: data.last_login_date,
            action: Actions.INSERT,
          });
          storageAction({
            name: StorageVar.TOKEN,
            value: bearer,
            action: Actions.INSERT,
          });
          setLoading(true);
          history.push("/home");
        })
        .catch(() => {
          setLoading(true);
          present({
            header: "Lo sentimos",
            message: "Algo salio mal al tratar de iniciar sesión.",
            buttons: ["Listo!"],
          });
          return;
        });
    };
    if (!loading) callLogin();
  }, [loading]);

  const handlerLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (email.isValid && password.isValid) {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
      <div className="center size-screen">
      <Spinner hidden={loading} />
      <IonCard>
        <IonCardHeader className="center">
          <IonImg
            src={"assets/img/logo.png"}
            alt="Logo questions"
            className="size-logo"
          />
        </IonCardHeader>
        <IonCardContent>
          <form className="ion-padding" onSubmit={handlerLogin} name="formLogin">
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Correo Electronico</IonLabel>
                    <IonInput
                      name="email"
                      value={email.value}
                      type="email"
                      inputMode="email"
                      autocomplete="email"
                      autofocus
                      clearInput
                      onIonChange={handlerOnChangeEmail}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12">
                  <IonText color="danger">
                    <p>{email.errorMSG}</p>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Contraseña</IonLabel>
                    <IonInput
                      name="password"
                      value={password.value}
                      type="password"
                      inputMode="text"
                      clearInput
                      onIonChange={handlerOnChangePassword}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12">
                  <IonText color="danger">
                    <p>{password.errorMSG}</p>
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
                    Iniciar sesión
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </form>
        </IonCardContent>
      </IonCard>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
