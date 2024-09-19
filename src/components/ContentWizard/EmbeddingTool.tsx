import { AlertPara, Button } from '@knicos/genai-base';
import { useEffect, useMemo, useState } from 'react';
import style from './style.module.css';
import { Checkbox, FormControlLabel, Slider } from '@mui/material';
import { useContentService } from '@genaism/hooks/services';
import { saveAs } from 'file-saver';
import { useChangeNodeType } from '@genaism/hooks/graph';
import SimilarityChecker from './SimilarityCheck';
import { useTranslation } from 'react-i18next';
import { Widget } from './Widget';
import TrainingGraph, { TrainingDataPoint } from '../TrainingGraph/TrainingGraph';

export default function EmbeddingTool() {
    const { t } = useTranslation();
    const [epochs, setEpochs] = useState(100);
    const [dims, setDims] = useState(20);
    const [startGenerate, setStartGenerate] = useState(false);
    const contentSvc = useContentService();
    const [blob, setBlob] = useState<Blob | undefined>();
    const content = useChangeNodeType('content');
    const [useLabels, setUseLabels] = useState(true);
    const [usePixels, setUsePixels] = useState(true);
    const [useEngagement, setUseEngagement] = useState(false);
    const [history, setHistory] = useState<TrainingDataPoint[]>([]);

    const valid = useMemo(() => {
        if (!startGenerate) {
            for (let i = 0; i < content.length; ++i) {
                const meta = contentSvc.getContentMetadata(content[i]);
                if (!meta || !meta.embedding) return false;
            }
        }
        return true;
    }, [contentSvc, content, startGenerate]);

    useEffect(() => {
        if (startGenerate) {
            setHistory([]);
            contentSvc
                .createEncoderModel({
                    noEngagementFeatures: !useEngagement,
                    noContentFeatures: !usePixels,
                    noTagFeatures: !useLabels,
                    layers: [128],
                    epochs,
                    dims,
                    noSave: false,
                    onEpoch: (e, l, v) => {
                        setHistory((old) => [...old, { epoch: e + 1, loss: l, validationLoss: v }]);
                    },
                })
                .then((b) => {
                    setBlob(b);
                    setStartGenerate(false);
                });
        }
    }, [startGenerate, contentSvc, epochs, dims, usePixels, useLabels, useEngagement]);

    return (
        <div
            className={style.widgetColumn}
            data-widget="container"
        >
            <Widget
                title={t('creator.titles.embedding')}
                dataWidget="embed"
                style={{ maxWidth: '300px' }}
            >
                {!valid && <AlertPara severity="info">{t('creator.messages.needsRegen')}</AlertPara>}
                <div className={style.group}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={useLabels}
                                onChange={(_, checked) => setUseLabels(checked)}
                            />
                        }
                        label={t('creator.labels.useLabels')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={usePixels}
                                onChange={(_, checked) => setUsePixels(checked)}
                            />
                        }
                        label={t('creator.labels.usePixels')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={useEngagement}
                                onChange={(_, checked) => setUseEngagement(checked)}
                            />
                        }
                        label={t('creator.labels.useEngagement')}
                    />
                </div>
                <div className={style.group}>
                    <label id="autoencoder-epoch-slider">{t('creator.labels.epochs')}</label>
                    <Slider
                        disabled={startGenerate}
                        aria-labelledby="autoencoder-epoch-slider"
                        value={epochs}
                        onChange={(_, value) => {
                            setEpochs(value as number);
                        }}
                        min={20}
                        max={600}
                        step={10}
                        valueLabelDisplay="auto"
                    />
                    <label id="autoencoder-dim-slider">{t('creator.labels.dimensions')}</label>
                    <Slider
                        disabled={startGenerate}
                        aria-labelledby="autoencoder-dim-slider"
                        value={dims}
                        onChange={(_, value) => {
                            setDims(value as number);
                        }}
                        min={4}
                        max={32}
                        step={2}
                        valueLabelDisplay="auto"
                    />
                </div>
                <div
                    className={style.group}
                    style={{ gap: '0.5rem' }}
                >
                    <Button
                        variant="contained"
                        disabled={startGenerate}
                        onClick={() => setStartGenerate(true)}
                    >
                        {t('creator.actions.generateEmbed')}
                    </Button>
                    <Button
                        disabled={!blob}
                        variant="outlined"
                        onClick={() => {
                            if (blob) {
                                saveAs(blob, 'encoder.zip');
                            }
                        }}
                    >
                        {t('creator.actions.saveEncoder')}
                    </Button>
                </div>
                <div className={style.group}>
                    <TrainingGraph
                        data={history}
                        maxEpochs={epochs}
                    />
                </div>
            </Widget>
            <Widget
                title={t('creator.titles.similarity')}
                dataWidget="similarity"
                style={{ maxWidth: '300px' }}
            >
                <SimilarityChecker />
            </Widget>
        </div>
    );
}
