import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import style from './style.module.css';
import { appConfiguration } from '@genaism/state/settingsState';
import { useEffect, useRef, useState } from 'react';
import { SMConfig } from '@genaism/views/Genagram/smConfig';

export default function RecommendationSettings() {
    const { t } = useTranslation();
    const [config, setConfig] = useRecoilState(appConfiguration);
    const [localConfig, setLocalConfig] = useState<SMConfig>(config);
    const debounce = useRef(-1);

    useEffect(() => {
        if (debounce.current >= 0) clearTimeout(debounce.current);
        debounce.current = window.setTimeout(() => {
            setConfig(localConfig);
            debounce.current = -1;
        }, 1000);
    }, [localConfig, setConfig]);

    return (
        <div className={style.column}>
            <FormControl sx={{ marginTop: '1rem' }}>
                <FormLabel id="demo-radio-buttons-group-label">{t('dashboard.labels.candidates')}</FormLabel>
                <div className={style.label}>{t('dashboard.labels.useTopicCandidates')}</div>
                <Slider
                    value={localConfig?.recommendations.taste || 0}
                    onChange={(_, value) =>
                        setLocalConfig((old) => ({
                            ...old,
                            recommendations: { ...old.recommendations, taste: value as number },
                        }))
                    }
                    min={0}
                    max={5}
                    step={0.1}
                />
                <div className={style.label}>{t('dashboard.labels.useRandomCandidates')}</div>
                <Slider
                    value={localConfig?.recommendations.random || 0}
                    onChange={(_, value) =>
                        setLocalConfig((old) => ({
                            ...old,
                            recommendations: { ...old.recommendations, random: value as number },
                        }))
                    }
                    min={0}
                    max={5}
                    step={0.1}
                />
                <div className={style.label}>{t('dashboard.labels.useCoengagedCandidates')}</div>
                <Slider
                    value={localConfig?.recommendations.coengaged || 0}
                    onChange={(_, value) =>
                        setLocalConfig((old) => ({
                            ...old,
                            recommendations: { ...old.recommendations, coengaged: value as number },
                        }))
                    }
                    min={0}
                    max={5}
                    step={0.1}
                />
                <div className={style.label}>{t('dashboard.labels.useSimilarUserCandidates')}</div>
                <Slider
                    value={localConfig?.recommendations.similarUsers || 0}
                    onChange={(_, value) =>
                        setLocalConfig((old) => ({
                            ...old,
                            recommendations: { ...old.recommendations, similarUsers: value as number },
                        }))
                    }
                    min={0}
                    max={5}
                    step={0.1}
                />
            </FormControl>
            <FormControl sx={{ marginTop: '1rem' }}>
                <FormLabel id="demo-radio-buttons-group-label">{t('dashboard.labels.scoring')}</FormLabel>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noTasteScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noTasteScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.tasteScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noSharingScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noSharingScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.sharingScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noCoengagementScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noCoengagementScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.coengagementScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noFollowingScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noFollowingScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.followingScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noCommentingScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noCommentingScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.commentingScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noLastSeenScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noLastSeenScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.lastSeenScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noReactionScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noReactionScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.reactionScore')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!(localConfig?.recommendations?.noViewingScore || false)}
                            onChange={(_, checked) =>
                                setLocalConfig((old) => ({
                                    ...old,
                                    recommendations: { ...old.recommendations, noViewingScore: !checked },
                                }))
                            }
                        />
                    }
                    label={t('dashboard.labels.viewingScore')}
                />
            </FormControl>
            <FormControl sx={{ marginTop: '1rem' }}>
                <FormLabel id="demo-radio-buttons-group-label">{t('dashboard.labels.selectionMechanism')}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="image"
                    name="radio-buttons-group"
                    value={localConfig?.recommendations?.selection || 'distribution'}
                    onChange={(_, value) =>
                        setLocalConfig((old) => ({
                            ...old,
                            recommendations: { ...old.recommendations, selection: value as 'distribution' | 'rank' },
                        }))
                    }
                >
                    <FormControlLabel
                        value="rank"
                        control={<Radio />}
                        label={t('dashboard.labels.rankSelection')}
                    />
                    <FormControlLabel
                        value="distribution"
                        control={<Radio />}
                        label={t('dashboard.labels.distributionSelection')}
                    />
                </RadioGroup>
            </FormControl>
        </div>
    );
}
