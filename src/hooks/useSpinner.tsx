import { useState } from "react"
import Spinner from "../components/spinner/spinner"

const useSpinner = ():[JSX.Element, (active: boolean) => void] => {
    const [active, setActive] = useState<boolean>(false)

    const spinner = <Spinner hidden={!active}/>

    return [spinner, setActive]
}

export default useSpinner