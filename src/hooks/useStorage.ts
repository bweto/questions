import { useState } from "react";
import { Storage } from "@ionic/storage";

export enum Actions {
    INSERT,
    UPDATE,
    DELETE,
    SELECT
}

export enum StorageVar {
    TOKEN = "TOKEN",
    PERMISSIONS = "PERMISSIONS",
    LAST_LOGIN = "LAST_LOGIN",
    EXAMS = "EXAMS"
}

export interface StoreValue {
    name?: StorageVar,
    value?: any,
    action?:Actions
}

const useStorage = (): [any, (storeValue: StoreValue) => void] => {

const [attribute, setAttribute] = useState<any>()

const storageAction = async (storageValue: StoreValue) => {
        const store = new Storage()
        await store.create()
      switch(storageValue.action){
            case Actions.INSERT: {
                await store.set(storageValue.name!, storageValue.value)
                break;
            }
            case Actions.UPDATE: {
                await store.remove(storageValue.name!)
                await store.set(storageValue.name!, storageValue.value)
                break;
            }
            case Actions.SELECT: {
               const registry = await store.get(storageValue.name!)
               setAttribute(registry)
               break;
            }
            case Actions.DELETE: {
                await store.clear()
                break;
            }
        }
}

    return [attribute, storageAction]
}

export default useStorage
