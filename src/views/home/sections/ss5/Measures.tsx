import { Vector3, BufferGeometry, LineBasicMaterial, Line } from 'three';

import CloudSetProps from './CloudSetProps';

const ZLVL_KEYS: { [key: string]: number } = {
    '4': 0,
    '3': 1,
    '2': 1,
    '1': 2,
    '0': 3,
    '-1': 4,
    '-2': 5,
    '-3': 5,
    '-4': 6,
    '-5': 7,
    '-6': 8,
    '-7': 8,
    '-8': 9,
    '-9': 10
}

const LEVEL_COLORS = {
    navyBlue: "#2F3C7E",
    smudgeWhite: "#FBEAEB",
    charcoal: "#101820",
    yellow: "#FEE715",
    candyCherry: "#F96167",
    cherry: "#990011",
    babyBlue: "#8AAAE5",
    babyPink: "#F7C5CC",
    darkGreen: "#025403",
    green: "#00FF00",
    navyGreen: "#3b5944",
    dawnPurple: "#735DA5",
    beachTeal: "#C4DFE6",
    cyan: "#66A5AD",
    darkCyan: "#20948B",
    darkOrange: "#FB6542",
    orange: "#ff9100",
    hotPink: "#fb00ff",
    magenta: "#c121ed",
    blue: "#2140ed",
    limeGreen: "#95ed21"
}

const COLOR_LEVELS = [
    LEVEL_COLORS.navyBlue,
    LEVEL_COLORS.smudgeWhite,
    LEVEL_COLORS.charcoal,
    LEVEL_COLORS.yellow,
    LEVEL_COLORS.candyCherry,
    LEVEL_COLORS.cherry,
    LEVEL_COLORS.babyBlue,
    LEVEL_COLORS.babyPink,
    LEVEL_COLORS.darkGreen,
    LEVEL_COLORS.green,
    LEVEL_COLORS.navyGreen,
    LEVEL_COLORS.dawnPurple,
    LEVEL_COLORS.beachTeal,
    LEVEL_COLORS.cyan,
    LEVEL_COLORS.darkCyan,
    LEVEL_COLORS.darkOrange,
    LEVEL_COLORS.orange,
    LEVEL_COLORS.hotPink,
    LEVEL_COLORS.magenta,
    LEVEL_COLORS.blue,
    LEVEL_COLORS.limeGreen
]

interface MeasureProps {
    nz: number[];
    vertical: boolean;
    colorLvl: string;
}

const Measure: React.FC<MeasureProps> = ({ nz, vertical, colorLvl }) => {
    let points: Vector3[] = [];
    if(vertical){
        points.push(new Vector3(nz[0], -12, nz[1]));
        points.push(new Vector3(nz[0], 12, nz[1]));
    } else {
        points.push(new Vector3(-12, nz[0], nz[1]));
        points.push(new Vector3(12, nz[0], nz[1]));
    }

    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: COLOR_LEVELS[ZLVL_KEYS[colorLvl]] });
    const line = new Line(lineGeometry, material);

    return <primitive object={line} />
}

const Measures: React.FC<CloudSetProps> = ({zLvl, addToBase}) => {
    return (
        <group>
            <group>
                <Measure nz={[-1, zLvl]} vertical={true} colorLvl={zLvl + ''} />
                <Measure nz={[1, zLvl]} vertical={true} colorLvl={zLvl + ''} />
            </group>

            { Array.from({ length: addToBase }, (_: number, index: number) => (
                <group key={`cloud-measure-set-${1 + index}`}>
                    <Measure nz={[-3 - index * 2, zLvl]} vertical={true} colorLvl={zLvl + ''}
                    key={`cloud-measures-z${zLvl}-i${index}`} />
                    <Measure nz={[3 + index * 2, zLvl]} vertical={true} colorLvl={zLvl + ''}
                    key={`cloud-measures-z${zLvl}-i${1 + index + addToBase}`} />
                </group>
            )) }
        </group>
    )
}

export default Measures;