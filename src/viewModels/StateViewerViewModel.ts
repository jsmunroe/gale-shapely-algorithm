import { GaleShapelyState } from "../algorithm/GaleShapely";
import { Evaluation, IParticipant } from "../contracts/IParticipant";
import IPreference from "../contracts/IPreference";
import { createTagger } from "../utilities/tags";

const backgroundTag = createTagger('background');

export default class StateViewerViewModel {
    public senders: SenderViewModel[];
    public receivers: ReceiverViewModel[];

    public pairs: PairViewModel[] = [];

    constructor(private state: GaleShapelyState) {
        const backgrounds = Array.from(Array(15).keys()).map(i => i * 60).map(i => `hsl(${i}, 70%, 80%)`);
        for (var sender of state.senders) {
            const color = backgrounds.shift();
            backgroundTag(sender, color);
        }

        for (var receiver of state.receivers) {
            const color = backgrounds.shift();
            backgroundTag(receiver, color);
        }

        for (let pair of state.pairs) {
            this.pairs.push(new PairViewModel(pair.sender, pair.receiver, pair.evaluation));    
        }

        this.senders = state.senders.map((_, index) => new SenderViewModel(state, index));
        this.receivers = state.receivers.map((_, index) => new ReceiverViewModel(state, index));
    }
}

class SenderViewModel {
    public background: string;
    public name: string;

    public isCurrent: boolean = false;
    public preferences: PreferenceViewModel[] = [];

    constructor(state: GaleShapelyState, senderIndex: number) {
        const sender = state.senders[senderIndex];
        this.background = backgroundTag(sender);
        this.name = sender.name;

        this.isCurrent = state.currentSender === sender;

        for (let preference of sender.preferences) {
            const preferenceViewModel = new PreferenceViewModel(preference);
            if (preference.evaluation === Evaluation.Reject) {
                preferenceViewModel.background = 'darkred';
            }
            else if (preference.evaluation === Evaluation.Hold) {
                preferenceViewModel.background = '#D69759';
            }
            else if (preference.evaluation === Evaluation.Accept) {
                preferenceViewModel.background = 'lime';
            }
            else if (sender.currentPreference?.id === preference.id) {
                preferenceViewModel.background = 'blue';
            }
            this.preferences.push(preferenceViewModel);
        }
    }

}

class ReceiverViewModel {
    public background: string;
    public name: string;

    public preferences: PreferenceViewModel[] = [];

    constructor(state: GaleShapelyState, receiverIndex: number) {
        const receiver = state.receivers[receiverIndex];
        this.background = backgroundTag(receiver);
        this.name = receiver.name;

        for (let preference of receiver.preferences) {
            const preferenceViewModel = new PreferenceViewModel(preference);

            if (preference.evaluation === Evaluation.Accept) {
                preferenceViewModel.background = 'lime';
                preferenceViewModel.strokeWidth = 2;
            }
            else if (preference.evaluation === Evaluation.Hold) {
                preferenceViewModel.background = '#D69759';
                preferenceViewModel.strokeWidth = 2;
            }
            else if (preference.evaluation === Evaluation.Reject) {
                preferenceViewModel.background = 'darkred';
                preferenceViewModel.strokeWidth = 2;
            }

            this.preferences.push(preferenceViewModel);
        }
    }
}

class PreferenceViewModel {
    public background = 'none';
    public foreground = 'black';
    public strokeWidth = 1;
    public name: string;

    constructor(preference: IPreference) {
        //this.background = backgroundTag(preference.participant);
        this.name = preference.name;
    }
}

class PairViewModel {
    public stroke: string;
    public strokeWidth: number = 3;

    constructor(public from: number, public to: number, public evaluation: Evaluation) {
        switch (evaluation) {
            case Evaluation.Accept:
                this.stroke = 'lime';
                this.strokeWidth = 3;
                break;
            case Evaluation.Hold:
                this.stroke = '#D69759';
                this.strokeWidth = 1;
                break;
            default:
                this.stroke = 'none';
                this.strokeWidth = 3;
                break;
        }
    }
}