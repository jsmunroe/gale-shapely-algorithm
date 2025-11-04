import { Evaluation, IParticipant } from "../contracts/IParticipant";
import IPreference from "../contracts/IPreference";
import { PreferenceSorter } from "../contracts/PreferenceSorter";
import Preference from "./Preference";
import { v4 } from 'uuid';


export default class Participant implements IParticipant {
    public readonly id: string = v4();

    private _preferences: IPreference[] = []
    private _currentPreferenceIndex: number = 0;

    private _acceptedOther: IParticipant | null = null;

    private _holdOther: IParticipant | null = null;

    get isFree(): boolean { 
        return this._acceptedOther === null;
    }

    get preferences(): IPreference[] {
        return this._preferences;
    }

    get acceptedOther(): IParticipant | null {
        return this._acceptedOther;
    }

    get holdOther(): IParticipant | null {
        return this._holdOther;
    }

    get currentPreference(): IPreference | null {
        return this._preferences[this._currentPreferenceIndex] ?? null;
    }

    constructor(public readonly name: string) { }

    setOthers(others: IParticipant[], sorter: PreferenceSorter = i => i): void {
        this._preferences = sorter(others).map((other, index) => new Preference(index, Evaluation.None, other));
    }

    static setOthers(senders: Participant[], receivers: Participant[], sorter: PreferenceSorter = i => i): void {
        for (var sender of senders) {
            sender.setOthers(receivers, sorter);
        }

        for (var receiver of receivers) {
            receiver.setOthers(senders, sorter);
        }
    }

    propose(run: (self: IParticipant, preferred: IParticipant) => Evaluation): void {
        if (!this.isFree) {
            return;
        }

        if (!this.currentPreference) {
            return;
        }

        let evaluation = run(this, this.currentPreference);

        this.currentPreference.evaluation = evaluation;

        switch (evaluation) {
            case Evaluation.Accept:
                this._holdOther = null;
                this._acceptedOther = this.currentPreference;
                break;

            case Evaluation.Reject:
                this._holdOther = null;
                this.next();
                break;

            case Evaluation.Hold:
            default:
                this._holdOther = this.currentPreference;
                break;
        }
    }

    evaluate(other: IParticipant): Evaluation.Accept | Evaluation.Hold | Evaluation.Reject {
        const topFree = this._preferences.find(preference => preference.isFree);

        if (this.acceptedOther) {
            return (this.acceptedOther.id === other.id) ? Evaluation.Accept : Evaluation.Reject;
        }

        if (topFree?.id === other.id) { // No better sender has proposed, so accept.
            this._holdOther = null;
            this._acceptedOther = other;
            return Evaluation.Accept;
        }

        const holdIndex = this._preferences.findIndex(preference => preference.id === this.holdOther?.id);
        const otherIndex = this._preferences.findIndex(preference => preference.id === other.id);

        if (this.isFree && (this.holdOther === null || holdIndex >= otherIndex)) {
            this._holdOther = other;
            return Evaluation.Hold;
        }

        return Evaluation.Reject;
    }

    protected next() {
        this._currentPreferenceIndex++;
    }
}