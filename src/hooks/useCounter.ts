import { useState } from "react";

interface useCounterReturn {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setCount: (value: number) => void
}

export function useCounter(initialValue: number = 0): useCounterReturn {
    const [count, setCount] = useState(initialValue);

    const increment = () => setCount(prev => prev + 1)
    const decrement = () => setCount(prev => prev - 1)
    const reset = () => setCount(initialValue)

    return {
        count,
        increment,
        decrement,
        reset,
        setCount
    }
}