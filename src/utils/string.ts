export function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "..."
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim().replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function isEmail(str: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str)
}

export function countWords(str: string): number {
    if (!str.trim()) return 0;
    // return str.trim().split(" ").length;
    // 'Hello    World'.split(" ") returns['Hello', '', '', '', 'World'] = 5 elements
    // 'Hello    World'.trim().split(/\s+/) returns['Hello', 'World'] = 2 words ✓
    return str.trim().split(/\s+/).length;
}

export function reverseString(str: string): string {
    return str.split("").reverse().join('')
}