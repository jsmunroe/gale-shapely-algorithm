import { useMemo, useState } from "react";
import GaleShapely, { GaleShapelyState } from "../algorithm/GaleShapely";
import Participant from "../algorithm/Participant";
import { randomSorter } from "../algorithm/PreferenceSorters";
import { Random } from "../utilities/random";

export default function useGaleShapely(stateProp: GaleShapelyState | null = null) {
    const stateMemo = useMemo(() => {
        if (stateProp) {
            return stateProp;
        }

        const senders = [
            new Participant('A'),
            new Participant('B'),
            new Participant('C'),
            new Participant('D'),
            new Participant('E'),
        ];

        const receivers = [
            new Participant('1'),
            new Participant('2'),
            new Participant('3'),
            new Participant('4'),
            new Participant('5'),
        ];

        const seed = Math.floor(Math.random() * 10000);
        console.log(`Using seed: ${seed}`);

        const random = Random.lcr(seed);

        Participant.setOthers(senders, receivers, randomSorter(random));

        const state = GaleShapely.initState(senders, receivers);
        return state;        

    }, []);

    const [state, setState] = useState(stateMemo);

    const step = () => {
        const algorithm = new GaleShapely();
        const newState = algorithm.step(state);
        setState(newState);
    }

    return {
        state,
        step,
    }
}