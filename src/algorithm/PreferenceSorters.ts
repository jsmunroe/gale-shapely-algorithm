import { PreferenceSorter } from "../contracts/PreferenceSorter";

export const randomSorter: PreferenceSorter = (items: any[]): any[] => {
    return items.sort(() => Math.random() - 0.5);
}