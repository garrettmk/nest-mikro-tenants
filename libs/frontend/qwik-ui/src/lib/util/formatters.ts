export function toLocaleDateString(value: unknown): string {
    return value 
        ? (new Date(value as string)).toLocaleDateString()
        : '--';
}
