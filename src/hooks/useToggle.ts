import { useState } from "react";


interface UseToggleReturn {
    value: boolean,
    toggle: () => void,
    setTrue: () => void,
    setFalse: () => void,
    setValue: (value: boolean) => void;
}

export function useToggle(initialValue: boolean = false): UseToggleReturn {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue(prev => !prev)
    const setTrue = () => setValue(true)
    const setFalse = () => setValue(false)

    return {
        value,
        toggle,
        setTrue,
        setFalse,
        setValue
    }
}