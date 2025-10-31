import { useMemo } from "react";
import { createTagger } from "../utilities/tags";

export default function useTagger<TValue, TItem=any>(name: string) {
    const tagger = useMemo(() => createTagger<TValue, TItem>(name), [name]);

    return tagger;
}