import { appConfiguration } from '@genaism/state/settingsState';
import AppNavigation from '@genaism/views/Genagram/AppNavigation';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useRecoilState } from 'recoil';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import RecommendationsProfile from '@genaism/components/RecommendationsProfile/RecommendationsProfile';

export default function RecomSettings() {
    const { t } = useTranslation();
    const [config, setConfig] = useRecoilState(appConfiguration);

    return (
        <div className={style.settingsContainer}>
            <div className={style.feedView}>
                <RecommendationsProfile />
                {!config.hideActionsButton && <AppNavigation code="x" />}
            </div>
            <div className={style.column}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={config?.hideRecommendationMenu || false}
                            onChange={(_, checked) => setConfig((old) => ({ ...old, hideRecommendationMenu: checked }))}
                        />
                    }
                    label={t('settings.app.hideRecommendationMenu')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={config?.showRecommendationWizard || false}
                            onChange={(_, checked) =>
                                setConfig((old) => ({ ...old, showRecommendationWizard: checked }))
                            }
                        />
                    }
                    label={t('settings.app.showRecommendationWizard')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={config?.hideCandidateOrigin || false}
                            onChange={(_, checked) => setConfig((old) => ({ ...old, hideCandidateOrigin: checked }))}
                        />
                    }
                    label={t('settings.app.hideCandidateOrigin')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={config?.hideExplainedScores || false}
                            onChange={(_, checked) => setConfig((old) => ({ ...old, hideExplainedScores: checked }))}
                        />
                    }
                    label={t('settings.app.hideExplainedScores')}
                />
            </div>
        </div>
    );
}
