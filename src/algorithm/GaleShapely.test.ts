import { expect, test } from "vitest";
import GaleShapely from "./GaleShapely"
import Participant from "./Participant";

test('run with 3 single offer senders and 3 receivers with preferred pairings', () => {

    const senderA = new Participant('A');
    const senderB = new Participant('B');
    const senderC = new Participant('C');

    const receiver1 = new Participant('1');
    const receiver2 = new Participant('2');
    const receiver3 = new Participant('3');

    senderA.setOthers([receiver1, receiver2, receiver3]);
    senderB.setOthers([receiver2, receiver3, receiver1]);
    senderC.setOthers([receiver3, receiver1, receiver2]);

    receiver1.setOthers([senderA, senderB, senderC]);
    receiver2.setOthers([senderB, senderC, senderA]);
    receiver3.setOthers([senderC, senderA, senderB]);

    const state = GaleShapely.initState(
        [senderA, senderB, senderC], 
        [receiver1, receiver2, receiver3]
    );

    const algorithm = new GaleShapely();

    const result = algorithm.run(state);

    expect(result).not.toBeNull();

    expect(senderA.acceptedOther?.name).toBe(receiver1.name);
    expect(senderB.acceptedOther?.name).toBe(receiver2.name);
    expect(senderC.acceptedOther?.name).toBe(receiver3.name);

    expect(receiver1.acceptedOther?.name).toBe(senderA.name);
    expect(receiver2.acceptedOther?.name).toBe(senderB.name);
    expect(receiver3.acceptedOther?.name).toBe(senderC.name);
});

test('run with 3 single offer senders and 3 receivers without preferred pairings', () => {

    const senderA = new Participant('A');
    const senderB = new Participant('B');
    const senderC = new Participant('C');

    const receiver1 = new Participant('1');
    const receiver2 = new Participant('2');
    const receiver3 = new Participant('3');

    senderA.setOthers([receiver1, receiver2, receiver3]);
    senderB.setOthers([receiver2, receiver3, receiver1]);
    senderC.setOthers([receiver3, receiver1, receiver2]);

    receiver1.setOthers([senderB, senderA, senderC]);
    receiver2.setOthers([senderA, senderB, senderC]);
    receiver3.setOthers([senderC, senderA, senderB]);

    const state = GaleShapely.initState(
        [senderA, senderB, senderC], 
        [receiver1, receiver2, receiver3]
    );

    const algorithm = new GaleShapely();

    const result = algorithm.run(state);

    expect(result).not.toBeNull();

    /* senderA prefers receiver1 who prefers senderB
     * senderB prefers receiver2 who prefers senderA
     * Because senders do proposals, senderA and senderB
     *   end up with their preferred receivers. 
     */

    expect(senderA.acceptedOther?.name).toBe(receiver1?.name);
    expect(senderB.acceptedOther?.name).toBe(receiver2?.name);
    expect(senderC.acceptedOther?.name).toBe(receiver3?.name);

    expect(receiver1.acceptedOther?.name).toBe(senderA?.name);
    expect(receiver2.acceptedOther?.name).toBe(senderB?.name);
    expect(receiver3.acceptedOther?.name).toBe(senderC?.name);
});

test('run with 2 single offer senders and 2 receivers with both senders preferring same', () => {

    const senderA = new Participant('A');
    const senderB = new Participant('B');

    const receiver1 = new Participant('1');
    const receiver2 = new Participant('2');

    senderA.setOthers([receiver1, receiver2]);
    senderB.setOthers([receiver1, receiver2]);

    receiver1.setOthers([senderB, senderA]);
    receiver2.setOthers([senderA, senderB]);

    const state = GaleShapely.initState(
        [senderA, senderB], 
        [receiver1, receiver2]
    );

    const algorithm = new GaleShapely();

    const result = algorithm.run(state);

    expect(result).not.toBeNull();

    /* Both senders prefer receiver1
     * Because sender A goes first and proposes to 1,
     *  1 holds. B then proposes to 1 who accepts
     *  leaving A with 2.
     * 
     * The only participant who is unhappy is A who
     *  settles for 2.
     */

    expect(senderA.acceptedOther?.name).toBe(receiver2?.name);
    expect(senderB.acceptedOther?.name).toBe(receiver1?.name);

    expect(receiver1.acceptedOther?.name).toBe(senderB?.name);
    expect(receiver2.acceptedOther?.name).toBe(senderA?.name);
});


test('run with 2 single offer senders and 2 receivers with both senders and both receivers preferring same', () => {

    const senderA = new Participant('A');
    const senderB = new Participant('B');

    const receiver1 = new Participant('1');
    const receiver2 = new Participant('2');

    senderA.setOthers([receiver1, receiver2]);
    senderB.setOthers([receiver1, receiver2]);

    receiver1.setOthers([senderB, senderA]);
    receiver2.setOthers([senderB, senderA]);

    const state = GaleShapely.initState(
        [senderA, senderB], 
        [receiver1, receiver2]
    );

    const algorithm = new GaleShapely();

    const result = algorithm.run(state);

    expect(result).not.toBeNull();

    /* Both senders prefer receiver1, and both 
     *  receivers prefer sender B.
     * 
     * Because sender A goes first and proposes to 1,
     *  1 holds. B then proposes to 1 who accepts
     *  leaving A with 2.
     * 
     * The only participant who is unhappy is A who
     *  settles for 2.
     */

    expect(senderA.acceptedOther?.name).toBe(receiver2?.name);
    expect(senderB.acceptedOther?.name).toBe(receiver1?.name);

    expect(receiver1.acceptedOther?.name).toBe(senderB?.name);
    expect(receiver2.acceptedOther?.name).toBe(senderA?.name);
});

test('run with 2 single offer senders and 2 receivers with both senders and both receivers preferring same', () => {

    const senderA = new Participant('A');
    const senderB = new Participant('B');
    const senderC = new Participant('C');

    const receiver1 = new Participant('1');
    const receiver2 = new Participant('2');

    senderA.setOthers([receiver1, receiver2]);
    senderB.setOthers([receiver1, receiver2]);
    senderC.setOthers([receiver2, receiver1]);

    receiver1.setOthers([senderB, senderC, senderA]);
    receiver2.setOthers([senderC, senderA, senderB]);

    const state = GaleShapely.initState(
        [senderA, senderB, senderC], 
        [receiver1, receiver2]
    );

    const algorithm = new GaleShapely();

    const result = algorithm.run(state);

    expect(result).not.toBeNull();

    expect(senderA.acceptedOther?.name).toBeUndefined();
    expect(senderB.acceptedOther?.name).toBe(receiver1?.name);
    expect(senderC.acceptedOther?.name).toBe(receiver2?.name);

    expect(receiver1.acceptedOther?.name).toBe(senderB?.name);
    expect(receiver2.acceptedOther?.name).toBe(senderC?.name);
});