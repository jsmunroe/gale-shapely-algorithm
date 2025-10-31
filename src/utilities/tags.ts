export function tag<TValue>(item: any, name: string, value?: TValue): TValue | undefined  {
    if (!item) {
        return;
    }

    if (typeof value === 'undefined') {
        if (!item._tags) {
            return undefined;
        }

        return item._tags[name];
    }

    item._tags ??= {};

    return item._tags[name] = value;
}

export function createTagger<TValue, TItem=any>(name: string): (item: TItem, value?:TValue) => TValue | undefined{
    return (item: TItem, value?: TValue) => tag<TValue>(item, name, value);
}