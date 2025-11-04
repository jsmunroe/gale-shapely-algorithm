import { Evaluation, IParticipant } from "../contracts/IParticipant";
import IPreference from "../contracts/IPreference";
import { copyTags } from "../utilities/tags";

export default class Preference implements IPreference {
    private readonly _participant: IParticipant;
    private _index: number;

    public evaluation: Evaluation = Evaluation.None;

    get index(): number {
        return this.index;
    }

    get participant(): IParticipant {
        return this._participant;
    }

    get id(): string {
        return this._participant.id;
    }

    get isFree(): boolean {
        return this._participant.isFree;
    }

    get name(): string {
        return this._participant.name;
    }

    get preferences(): IPreference[] {
        return this._participant.preferences;
    }

    get currentPreference(): IPreference | null {
        return this._participant.currentPreference;
    }

    propose(run: (self: IParticipant, preferred: IParticipant) => Evaluation): void {
        this._participant.propose(run);
    }

    evaluate(other: IParticipant): Evaluation.Accept | Evaluation.Hold | Evaluation.Reject {
        const evaluation = this._participant.evaluate(other);

        var preference = this.preferences.find(p => p.id === other.id);

        if (preference) {
            preference.evaluation = evaluation;
        }

        return evaluation;
    }

    constructor(index: number, evaluation: Evaluation, participant: IParticipant) {
        this._participant = participant;
        this._index = index;
        this.evaluation = evaluation;

        copyTags(participant, this);
    }

}