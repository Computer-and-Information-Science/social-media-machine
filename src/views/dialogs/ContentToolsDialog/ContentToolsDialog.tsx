import { menuShowContentTools } from '@genaism/state/menuState';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { Button } from '@knicos/genai-base';
import RawEmbeddingTool from './RawEmbeddingTool';
import EmbeddingTool from './EmbeddingTool';
import MappingTool from './MappingTool';
import SimilarityChecker from './SimilarityChecker';
import ClusteringTool from './ClusteringTool';

export default function ContentToolsDialog() {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useRecoilState(menuShowContentTools);
    const [tabNumber, setTabNumber] = useState(0);

    const doClose = useCallback(() => setShowDialog(false), [setShowDialog]);

    return (
        <Dialog
            open={showDialog}
            onClose={doClose}
            scroll="paper"
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>{t('dashboard.titles.contentTools')}</DialogTitle>
            <DialogContent sx={{ display: 'flex', padding: 0, maxHeight: '600px' }}>
                <Tabs
                    value={tabNumber}
                    onChange={(_, value) => setTabNumber(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    orientation="vertical"
                    sx={{ borderRight: '1px solid #008297' }}
                >
                    <Tab label={t('dashboard.titles.rawEmbeddingTool')} />
                    <Tab label={t('dashboard.titles.embeddingTool')} />
                    <Tab label={t('dashboard.titles.mappingTool')} />
                    <Tab label={t('dashboard.titles.similarityTool')} />
                    <Tab label={t('dashboard.titles.clusteringTool')} />
                </Tabs>
                {tabNumber === 0 && <RawEmbeddingTool />}
                {tabNumber === 1 && <EmbeddingTool />}
                {tabNumber === 2 && <MappingTool />}
                {tabNumber === 3 && <SimilarityChecker />}
                {tabNumber === 4 && <ClusteringTool />}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={doClose}
                >
                    {t('dashboard.actions.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
