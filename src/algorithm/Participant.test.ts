import { expect, test, vi } from "vitest";
import GaleShapely from "./GaleShapely"
import Participant from "./Participant";
import { Evaluation, IParticipant } from "../contracts/IParticipant";
import { mock } from "vitest-mock-extended";

test('propose with accept', () => {
    const participant = new Participant('A');

    const others = [
        new Participant('1'),
        new Participant('2'),
        new Participant('3'),
    ]

    participant.setOthers(others);

    participant.propose((self, preferred) => {
        expect(self).toBe(participant);
        expect(preferred).toBe(participant.currentPreference);

        return Evaluation.Accept;
    });

    expect(participant.acceptedOther).toBe(others[0]);
    expect(participant.holdOther).toBeNull();
}) 

test('propose with hold', () => {
    const participant = new Participant('A');

    const others = [
        new Participant('1'),
        new Participant('2'),
        new Participant('3'),
    ]

    participant.setOthers(others);

    participant.propose((self, preferred) => {
        expect(self).toBe(participant);
        expect(preferred).toBe(participant.currentPreference);
        expect(preferred).toBe(others[0]);

        return Evaluation.Hold;
    });

    expect(participant.acceptedOther).toBeNull();
    expect(participant.holdOther).toBe(others[0]);
})

test('propose with reject', () => {
    const participant = new Participant('A');

    const others = [
        new Participant('1'),
        new Participant('2'),
        new Participant('3'),
    ]

    participant.setOthers(others);

    participant.propose((self, preferred) => {
        expect(self).toBe(participant);
        expect(preferred).toBe(participant.currentPreference);
        expect(preferred).toBe(others[0]);

        return Evaluation.Reject;
    });

    expect(participant.acceptedOther).toBeNull();
    expect(participant.holdOther).toBeNull();
    expect(participant.currentPreference).toBe(others[1]);
})

test('evaluate favorite', () => {
    const participant = new Participant('1');

    const others = [
        new Participant('A'),
        new Participant('B'),
        new Participant('C'),
    ];

    participant.setOthers(others);

    const result = participant.evaluate(others[0]);

    expect(result).toBe(Evaluation.Accept);
    expect(participant.holdOther).toBeNull();
    expect(participant.acceptedOther).toBe(others[0]);
})


test('evaluate second favorite', () => {
    const participant = new Participant('1');

    const others = [
        new Participant('A'),
        new Participant('B'),
        new Participant('C'),
    ];

    participant.setOthers(others);

    const result = participant.evaluate(others[1]);

    expect(result).toBe(Evaluation.Hold);
    expect(participant.holdOther).toBe(others[1]);
})

test('evaluate least favorite', () => {
    const participant = new Participant('1');

    const others = [
        new Participant('A'),
        new Participant('B'),
        new Participant('C'),
    ];

    participant.setOthers(others);

    const result = participant.evaluate(others[2]);

    expect(result).toBe(Evaluation.Hold);
    expect(participant.holdOther).toBe(others[2]);
})
