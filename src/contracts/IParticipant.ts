import IPreference from "./IPreference";

export enum Evaluation {
    None = 'None',
    Accept = 'Accept',
    Reject = 'Reject',
    Hold = 'Hold'
}

export interface IParticipant {
    readonly id: string;

    readonly isFree: boolean;
    readonly name: string;

    readonly preferences: IPreference[];

    readonly currentPreference: IPreference | null;

    propose(run: (self: IParticipant, preferred: IParticipant) => Evaluation): void
    evaluate(other: IParticipant): Evaluation.Accept | Evaluation.Hold | Evaluation.Reject;
}