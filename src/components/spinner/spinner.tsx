import { IonLabel, IonSpinner } from "@ionic/react";
import React from "react";
import "./spinner.css";

export type SpinnerProps = {
  hidden: boolean;
};

const Spinner: React.FC<SpinnerProps> = ({ hidden }) =>
  hidden ? null : (
    <div className="size">
      <IonSpinner name="crescent" className="spinner" />
      <IonLabel title="Cargando..."></IonLabel>
    </div>
  );

export default Spinner;
