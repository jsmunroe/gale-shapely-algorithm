"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var IParticipant_1 = require("../contracts/IParticipant");
var GaleShapely = /** @class */ (function () {
    function GaleShapely() {
    }
    GaleShapely.initState = function (senders, receivers) {
        return {
            senders: senders,
            receivers: receivers,
            currentSenderIndex: null,
            currentSender: null,
            currentReceiver: null,
            evaluation: IParticipant_1.Evaluation.None,
        };
    };
    GaleShapely.prototype.run = function (state) {
        do {
            state = this.step(state);
        } while (state.senders.some(function (participant) { return participant.isFree; })
            && state.receivers.some(function (participant) { return participant.isFree; }));
        return state;
    };
    GaleShapely.prototype.step = function (state) {
        var currentSenderIndex = state.currentSenderIndex !== null
            ? (state.currentSenderIndex + 1) % state.senders.length
            : 0;
        var currentSender = state.senders[currentSenderIndex];
        state = __assign(__assign({}, state), { currentSenderIndex: currentSenderIndex, currentSender: currentSender });
        if (!currentSender.isFree) {
            return state;
        }
        currentSender.offer(state.receivers, function (self, preferred) {
            var evaluation = preferred.evaluate(self);
            state = __assign(__assign({}, state), { currentReceiver: preferred, evaluation: evaluation });
            return evaluation;
        });
        return state;
    };
    return GaleShapely;
}());
exports.default = GaleShapely;
//# sourceMappingURL=GaleShapely.js.map