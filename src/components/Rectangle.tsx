import { useMemo } from "react"

type RectangleProps = {
    cornerRadius?: number,
    left?: number,
    top?: number,
    width?: number,
    height?: number,
    centerX?: number,
    centerY?: number,
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
}

export default function Rectangle({left, top, width = 50, height = 50, centerX, centerY, fill="none", stroke="black", strokeWidth=1, cornerRadius=0 }: RectangleProps) {
    const path = useMemo(() => {
        left = left ? left : centerX ? (centerX - width/2) : 0;
        top = top ? top : centerY ? (centerY - height/2) : 0;

        return `m${left + cornerRadius},${top} h${width - cornerRadius*2} a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} v${height - cornerRadius*2} a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} h-${width - cornerRadius*2} a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},-${cornerRadius} v-${height - cornerRadius*2} a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},-${cornerRadius} z`; 
    }, [left, top, width, height, centerX, centerY, cornerRadius]);

    return <path d={path} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
}