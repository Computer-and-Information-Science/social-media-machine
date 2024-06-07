import { PieChart } from '@mui/x-charts';
import style from './style.module.css';
import colors from '../../style/colours.module.css';

interface Props {
    label?: string;
    value: number;
    maxValue: number;
    minValue?: number;
    showValue?: boolean;
    size?: number;
    color?: string;
}

export default function ScorePie({ label, value, maxValue, size = 80, showValue, color = '#444444' }: Props) {
    //const { t } = useTranslation();
    /*const selectedScores: number[] = [];
    if (item.significance) {
        item.significance.forEach((s, ix) => {
            if (s > 0) selectedScores.push(ix);
        });
        selectedScores.sort((a, b) => (item.significance ? item.significance[b] - item.significance[a] : 0));
    }*/

    return (
        <div className={style.scoreBox}>
            <PieChart
                width={size}
                height={size}
                series={[
                    {
                        outerRadius: size / 2 - 5,
                        innerRadius: Math.floor((size / 2 - 5) * 0.8),
                        paddingAngle: 4,
                        startAngle: -180,
                        endAngle: 180,
                        cx: size / 2 - 5,
                        cy: size / 2 - 5,
                        data: [
                            {
                                value,
                                color,
                            },
                            {
                                value: maxValue - value,
                                color: colors.bgSubdued1,
                            },
                        ],
                    },
                ]}
            />
            {showValue && (
                <div
                    className={style.scoreValue}
                    style={{ height: `${size}px`, fontSize: `${Math.floor(size * 0.3)}px` }}
                >
                    {value.toFixed(1)}
                </div>
            )}
            {label && <label>{label}</label>}
        </div>
    );
}
