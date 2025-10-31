import { useMemo, useState } from "react";
import GaleShapely, { GaleShapelyState } from "../algorithm/GaleShapely";
import Participant from "../algorithm/Participant";
import { randomSorter } from "../algorithm/PreferenceSorters";

export default function useGaleShapely(stateProp: GaleShapelyState | null = null) {
    const stateMemo = useMemo(() => {
        if (stateProp) {
            return stateProp;
        }

        const senderA = new Participant('A');
        const senderB = new Participant('B');
        const senderC = new Participant('C');

        const receiver1 = new Participant('1');
        const receiver2 = new Participant('2');
        const receiver3 = new Participant('3');

        senderA.setOthers([receiver1, receiver2, receiver3], randomSorter);
        senderB.setOthers([receiver2, receiver3, receiver1], randomSorter);
        senderC.setOthers([receiver3, receiver1, receiver2], randomSorter);

        receiver1.setOthers([senderB, senderA, senderC], randomSorter);
        receiver2.setOthers([senderA, senderB, senderC], randomSorter);
        receiver3.setOthers([senderC, senderA, senderB], randomSorter);

        let state = GaleShapely.initState(
            [senderA, senderB, senderC], 
            [receiver1, receiver2, receiver3]
        );

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