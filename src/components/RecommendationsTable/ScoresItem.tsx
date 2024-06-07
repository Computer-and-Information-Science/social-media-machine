import { useTranslation } from 'react-i18next';
import { ScoredRecommendation } from '@genaism/services/recommender/recommenderTypes';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScorePie from './ScorePie';
import style from './style.module.css';
import sColors from '../../style/colours.module.css';

interface Props {
    item: ScoredRecommendation;
}

export default function ScoresItem({ item }: Props) {
    const { t } = useTranslation();

    return (
        <li data-testid="score-item">
            <div className={style.listIcon}>
                <EmojiEventsIcon fontSize="large" />
            </div>
            <div className={style.listColumn}>
                <div className={style.scoreList}>
                    <ScorePie
                        value={item.score || 0}
                        maxValue={1}
                        label={t(`recommendations.labels.score`)}
                        showValue
                        color={sColors.secondary}
                        size={80}
                    />
                </div>
            </div>
        </li>
    );
}
