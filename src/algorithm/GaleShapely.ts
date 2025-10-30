import { IAlgorithm } from "../contracts/IAlgorithm";
import { Evaluation, IParticipant } from "../contracts/IParticipant";

type GaleShapelyState = {
    senders: IParticipant[];
    receivers: IParticipant[];

    currentSenderIndex: number | null;
    currentSender: IParticipant | null;

    currentReceiver: IParticipant | null;

    evaluation: Evaluation;
}

export default class GaleShapely implements IAlgorithm<GaleShapelyState> {
    static initState(senders: IParticipant[], receivers: IParticipant[]) {
        return {
            senders,
            receivers,

            currentSenderIndex: null,
            currentSender: null,

            currentReceiver: null,

            evaluation: Evaluation.None,
        }
    }

    run(state: GaleShapelyState): GaleShapelyState {
        let steps = 0;

        do {
            state = this.step(state);
            steps++;

        } while (state.senders.some(participant => participant.isFree) 
            && state.receivers.some(participant => participant.isFree) 
            && steps < 100);

        return state;
    }

    step(state: GaleShapelyState): GaleShapelyState {
        const currentSenderIndex = state.currentSenderIndex !== null 
            ? (state.currentSenderIndex + 1) % state.senders.length
            : 0;

        const currentSender = state.senders[currentSenderIndex];

        state = {...state, currentSenderIndex, currentSender };

        if (!currentSender.isFree) {
            return state;
        }
 
        currentSender.propose((self, preferred) => {
            const evaluation = preferred.evaluate(self);

            state = {...state, currentReceiver: preferred, evaluation};

            console.log(`${self.name} proposed to ${preferred.name} who ${evaluation.toLowerCase()}s.`)

            return evaluation;
        })

        return state;
    }
}