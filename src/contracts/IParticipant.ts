export enum Evaluation {
    None = 'None',
    Accept = 'Accept',
    Reject = 'Reject',
    Hold = 'Hold'
}

export interface IParticipant {
    readonly isFree: boolean;
    readonly name: string;

    propose(run: (self: IParticipant, preferred: IParticipant) => Evaluation): void
    evaluate(other: IParticipant): Evaluation.Accept | Evaluation.Hold | Evaluation.Reject;
}