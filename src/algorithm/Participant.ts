import { prefetchDNS } from "react-dom";
import { Evaluation, IParticipant } from "../contracts/IParticipant";


export default class Participant implements IParticipant {
    private _preferences: IParticipant[] = []
    private _currentPreferenceIndex: number = 0;

    private _acceptedOther: IParticipant | null = null;

    private _holdOther: IParticipant | null = null;

    get isFree(): boolean { 
        return this._acceptedOther === null;
    }

    get acceptedOther(): IParticipant | null {
        return this._acceptedOther;
    }

    get holdOther(): IParticipant | null {
        return this._holdOther;
    }

    get currentPreference(): IParticipant | null {
        return this._preferences[this._currentPreferenceIndex] ?? null;
    }

    constructor(public readonly name: string) { }

    setOthers(others: IParticipant[]) {
        this._preferences = others;
    }

    propose(run: (self: IParticipant, preferred: IParticipant) => Evaluation): void {
        if (!this.isFree) {
            return;
        }

        if (!this.currentPreference) {
            return;
        }

        if (!this.currentPreference.isFree) {
            this.next();
            return;
        }

        const evaluation = run(this, this.currentPreference);

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
            return (this.acceptedOther === other) ? Evaluation.Accept : Evaluation.Reject;
        }

        if (topFree === other 
            || this.holdOther === other) { // No better sender has proposed, so accept.

            this._holdOther = null;
            this._acceptedOther = other;
            return Evaluation.Accept;
        }

        const holdIndex = this._preferences.findIndex(preference => preference === this.holdOther);
        const otherIndex = this._preferences.findIndex(preference => preference === other);

        if (this.isFree && (this.holdOther === null || holdIndex >= otherIndex)) {
            this._holdOther = other;
            return Evaluation.Hold;
        }

        return Evaluation.Reject;
    }

    protected next() {
        this._currentPreferenceIndex++;
    }

    protected selectPreferences(others: IParticipant[]): IParticipant[] {
        // Sort randomly

        let choices = [...others];
        let selected: IParticipant[] = []

        while (choices.length > 0) {
            const selectionIndex = Math.floor(Math.random() * choices.length);
            const selection = choices[selectionIndex]

            choices = choices.filter((_, i) => i !== selectionIndex);
            selected = [...selected, selection];
        }

        return selected;
    }
}