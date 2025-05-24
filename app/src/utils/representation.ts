/**
 * Formate un nombre en insérant un espace tous les 3 chiffres.
 * @param value Le nombre ou la chaîne de chiffres à formater
 * @returns La chaîne formatée, ex. 1119909 → "1 119 909"
 */
export function formatWithSpaces(value: number | string): string {
    const str = value.toString();
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatPrice(value: number | string): string {
    const str = formatWithSpaces(value);
    return `${str} €`;
}
