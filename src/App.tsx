import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/login/Login";
import Course from "./pages/course/Course";
import { useEffect, useMemo, useState } from "react";
import { TokenContext } from "./hooks/useTokenContext";
import useStorage, { Actions, StorageVar } from "./hooks/useStorage";
import Exams from "./pages/exams/Exams";
import Section from "./pages/section/Sections";
import QuestionPage from "./pages/question/Question";

const App: React.FC = () => {
  const [attribute, storageAction] = useStorage();
  const [token, setToken] = useState<string>("");
  const providerValue = useMemo(() => ({ token, setToken }), [token, setToken]);

  useEffect(() => {
    const existToken = () => {
      storageAction({
        name: StorageVar.TOKEN,
        action: Actions.SELECT,
      });
      setToken(attribute);
    };
    existToken();
  }, [attribute, storageAction]);

  return (
    <IonApp>
      <TokenContext.Provider value={providerValue}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact>
            {attribute ? <Course /> : <Login />}
            </Route>
            <Route path="/home" exact>
              < Course />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/exam/:id" exact>
              < Exams />
            </Route>
            <Route path="/section/:idCourse/:idExam" exact>
              < Section />
            </Route>
            <Route path="/question/:idCourse/:idExam/:idSection" exact>
              < QuestionPage />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </TokenContext.Provider>
    </IonApp>
  );
};

export default App;
