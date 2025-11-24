export function unique<T>(arr: T[]): T[] {
    return [... new Set(arr)]
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {

    return arr.reduce((result, item) => {
        const groupKey = String(item[key]);

        if (!result[groupKey]) {
            result[groupKey] = [];
        }

        result[groupKey].push(item);

        return result
    }, {} as Record<string, T[]>)


}

export function chunk<T>(arr: T[], size: number): T[][] {
    if (size <= 0) throw new Error("Chunk size must be greater than 0")

    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
    }

    return result
}

export function sortBy<T>(arr: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
    return [...arr].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;

        return 0
    })
}

export function findDuplicates<T>(arr: T[]): T[] {
    const seen = new Set<T>();
    const duplicates = new Set<T>();

    arr.forEach(item => {
        if (seen.has(item)) {
            duplicates.add(item)
        } else {
            seen.add(item)
        }
    })

    return Array.from(duplicates)
}