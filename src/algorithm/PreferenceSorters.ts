import { PreferenceSorter } from "../contracts/PreferenceSorter";

export const randomSorter = (random: () => number): PreferenceSorter => (items: any[]): any[] => {
    return [...items].sort(() => random() - 0.5);
}