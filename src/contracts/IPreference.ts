import { Evaluation, IParticipant } from "./IParticipant";

export default interface IPreference extends IParticipant{
    readonly index: number;
    evaluation: Evaluation;

    readonly participant: IParticipant;
}