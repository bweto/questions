import { useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import { ExamsResp } from "../service/Exams";

export enum Actions {
    INSERT,
    UPDATE,
    DELETE,
    SELECT
}


export interface StoreExam {
    idCourse: string,
    examsOfCourse?: any,
    action:Actions
}

const useStorageExam = (): [ExamsResp | undefined, (storeValue: StoreExam) => Promise<ExamsResp | undefined>, string, (storeValue: string) => Promise<string>] => {
    
    const [examStorage, setExamStorage] = useState<ExamsResp | undefined>(undefined);  
    const [resultIdStore, setResultIdStore] = useState<string>("");
    
    const getResultId = async (idExam: string) => {
        const store = new Storage( {
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        })
         await store.create()
        const registry =  await store.get(idExam);
        const exams = registry
        setResultIdStore(exams);
        return registry
    }

    const setExamOperation = async (storageExam: StoreExam) => {

        const store = new Storage( {
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        })
         await store.create()
      switch(storageExam.action){
            case Actions.INSERT: {
                await store.set(storageExam.idCourse, JSON.stringify(storageExam.examsOfCourse));
                setExamStorage(storageExam.examsOfCourse);
                return storageExam.examsOfCourse;
            }
            case Actions.UPDATE: {
                await store.remove(storageExam.idCourse)
                const ex: ExamsResp = storageExam.examsOfCourse!;
                await store.set(storageExam.idCourse, ex);
                setExamStorage(storageExam.examsOfCourse);
                return storageExam.examsOfCourse;
            }
            case Actions.SELECT: {
               const registry =  await store.get(storageExam.idCourse)
               const exams = registry
               setExamStorage(exams)
               return exams;
            }
            case Actions.DELETE: {
                await store.clear()
                setExamStorage(undefined);
                return undefined;
            }
        }
}

    return [examStorage, setExamOperation, resultIdStore, getResultId]
}

export default useStorageExam;
