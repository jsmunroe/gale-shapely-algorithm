import { IAlgorithm } from "../contracts/IAlgorithm";
import { Evaluation, IParticipant } from "../contracts/IParticipant";

export type GaleShapelyState = {
    senders: IParticipant[];
    receivers: IParticipant[];

    currentSenderIndex: number | null;
    currentSender: IParticipant | null;

    pairs: Pairing[];

    evaluation: Evaluation;
}

export type Pairing = {
    sender: number;
    receiver: number;
    evaluation: Evaluation;
}

export default class GaleShapely implements IAlgorithm<GaleShapelyState> {
    static initState(senders: IParticipant[], receivers: IParticipant[]): GaleShapelyState {
        return {
            senders,
            receivers,

            currentSenderIndex: null,
            currentSender: null,

            pairs: [],

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
        if (!state.senders.some(participant => participant.isFree)) {
            return state;
        }

        state.currentSenderIndex ??= -1;

        const currentSenderIndex = (state.currentSenderIndex + 1) % state.senders.length;

        const currentSender = state.senders[currentSenderIndex];

        state = {...state, currentSenderIndex, currentSender };

        if (!currentSender.isFree) {
            return state;
        }
 
        currentSender.propose((self, preferred) => {
            const evaluation = preferred.evaluate(self);

            const selfIndex = state.senders.findIndex(s => s.id === self.id);
            const preferredIndex = state.receivers.findIndex(p => p.id === preferred.id);

            let { pairs } = state; 

            if (evaluation === Evaluation.Accept) {
                pairs = pairs.filter(pair => pair.sender !== selfIndex && pair.receiver !== preferredIndex);
            }

            pairs = pairs.filter(pair => pair.sender !== selfIndex);

            pairs = [...pairs, { sender: selfIndex, receiver: preferredIndex, evaluation }];

            state = {...state, pairs, evaluation};

            console.log(`${self.name} proposed to ${preferred.name} who ${evaluation.toLowerCase()}s.`)

            return evaluation;
        })

        return state;
    }
}