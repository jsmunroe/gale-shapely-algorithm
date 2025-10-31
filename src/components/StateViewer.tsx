import { Fragment, useMemo } from "react"
import { GaleShapelyState } from "../algorithm/GaleShapely"
import { useTagger } from "../hooks"
import Rectangle from "./Rectangle"
import colors from "../data/colors.json";

type StateViewerProps = {
    state: GaleShapelyState
}

export default function StateViewer({state}: StateViewerProps) {
    const backgroundTag = useTagger<string>('background-color');

    useMemo(() => {
        const backgrounds = [...colors];
        for (var sender of state.senders) {
            const color = backgrounds.shift();
            backgroundTag(sender, color);
        }

        for (var receiver of state.receivers) {
            const color = backgrounds.shift();
            backgroundTag(receiver, color);
        }
    }, [state])

    return (
        <svg width={500} height={500} style={{width: '100%'}}>
            {state.senders.map((sender, index) => (
                <Fragment key={sender.name}>
                    <Rectangle left={25} top={25 + index * 150} width={100} height={50} cornerRadius={5} strokeWidth={3} fill={backgroundTag(sender)}/>
                    <text x={40} y={58 + index * 150} fontSize="1.5em" fontWeight="bold">{sender.name}</text>
                </Fragment>
            ))}

            {state.receivers.map((receiver, index) => (
                <Fragment key={receiver.name}> 
                    <Rectangle left={325} top={25 + index * 150} width={100} height={50} cornerRadius={5} strokeWidth={3} fill={backgroundTag(receiver)}/>
                    <text x={390} y={58 + index * 150} fontSize="1.5em" fontWeight="bold">{receiver.name}</text>
                </Fragment>
            ))}

            {state.pairs.map(([from, to]) => (
                <line key={`${from}-${to}`} x1={150} y1={50 + from * 150} x2={300} y2={50 + to * 150} stroke="black" strokeWidth={3}/>
            ))}
        </svg>
    )
}