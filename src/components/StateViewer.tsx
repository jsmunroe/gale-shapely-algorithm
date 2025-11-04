import { Fragment, useMemo } from "react"
import { GaleShapelyState } from "../algorithm/GaleShapely"
import { useTagger } from "../hooks"
import Rectangle from "./Rectangle"
import colors from "../data/colors.json";
import { Evaluation } from "../contracts/IParticipant";
import StateViewerViewModel from "../viewModels/StateViewerViewModel";

type StateViewerProps = {
    state: GaleShapelyState
}

export default function StateViewer({state}: StateViewerProps) {
    const viewModel = useMemo(() => new StateViewerViewModel(state), [state]);

    return (
        <svg width={550} height={550} style={{width: '100%'}}>
            {viewModel.senders.map((sender, index) => (
                <Fragment key={sender.name}>
                    <Rectangle left={25} top={25 + index * 100} width={100} height={50} cornerRadius={5} strokeWidth={3} fill={sender.background}/>
                    <text x={40} y={58 + index * 100} fontSize="1.5em" fontWeight="bold">{sender.name}</text>
                    {sender.isCurrent && <Rectangle left={20} top={20 + index * 100} width={110} height={60} cornerRadius={10} strokeWidth={2} stroke="lime" fill="none"/> }

                    {sender.preferences.map((preference, preferenceIndex) => (
                        <Fragment key={`${preference.name}`}>
                            <Rectangle left={25 + 20 * preferenceIndex} top={83 + index * 100} width={18} height={18} fill={preference.background} strokeWidth={preference.strokeWidth} stroke={preference.foreground}/>
                            <text x={29 + 20 * preferenceIndex} y={97 + index * 100} fontSize="0.8em" fontWeight="bold">{preference.name}</text>
                        </Fragment>
                    ))}
                </Fragment>
            ))}

            {viewModel.receivers.map((receiver, index) => (
                <Fragment key={receiver.name}>
                    <Rectangle left={325} top={25 + index * 100} width={100} height={50} cornerRadius={5} strokeWidth={3} fill={receiver.background}/>
                    <text x={390} y={58 + index * 100} fontSize="1.5em" fontWeight="bold">{receiver.name}</text>

                    {receiver.preferences.map((preference, preferenceIndex) => (
                        <Fragment key={`${preference.name}`}>
                            <Rectangle left={325 + 20 * preferenceIndex} top={83 + index * 100} width={18} height={18} fill={preference.background} stroke={preference.foreground}/>
                            <text x={329 + 20 * preferenceIndex} y={97 + index * 100} fontSize="0.8em" fontWeight="bold">{preference.name}</text>
                        </Fragment>
                    ))}
                </Fragment>
            ))}

            {viewModel.pairs.map(({from, to, stroke, strokeWidth}) => (
                <Fragment key={`${from}-${to}`}>
                    <line key={`${from}-${to}`} x1={150} y1={50 + from * 100} x2={300} y2={50 + to * 100} stroke={stroke} strokeWidth={strokeWidth}/>
                </Fragment>
            ))}

        </svg>
    )
}