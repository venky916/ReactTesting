export function add(a: number, b: number): number {
    return a + b
}

export function multiply(a: number, b: number): number {
    return a * b
}

export function divide(a: number, b: number): number {
    if (b == 0) {
        throw new Error("Cannot divide by zero")
    }
    return a / b
}

export function remainder(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Cannot divide by zero")
    }
    return a % b
}

export function percentage(value: number, total: number): number {
    if (total === 0) {
        throw new Error("Total cannot be zero")
    }
    return (value / total) * 100
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}


export function average(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error("Array cannot be empty")
    }

    const sum = numbers.reduce((acc, num) => acc + num, 0)
    return sum / numbers.length;
}