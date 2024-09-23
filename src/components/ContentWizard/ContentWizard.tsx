import style from './style.module.css';
import QueryGenerator from './QueryGenerator';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Options } from '@genaism/services/imageSearch/hook';
import ContentSummary from './ContentSummary';
import BlockIcon from '@mui/icons-material/Block';
import EmbeddingTool from './Embedding/EmbeddingTool';
import CaptureDialog from './CaptureDialog';
import IconMenu from '../IconMenu/IconMenu';
import IconMenuItem from '../IconMenu/Item';
import { IconButton } from '@mui/material';
import { useContentService } from '@genaism/hooks/services';
import ContentClustering from './Cluster/ContentClustering';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import SvgLayer, { ILine } from './SvgLayer';
import { extractNodesFromElements, generateLines, IConnection } from './lines';
import MappingTool from './MappingEncoder';

const connections: IConnection[] = [
    { start: 'query', end: 'summary', startPoint: 'right', endPoint: 'left' },
    { start: 'summary', end: 'embed', startPoint: 'right', endPoint: 'left' },
    { start: 'embed', end: 'cluster', startPoint: 'right', endPoint: 'left' },
    { start: 'cluster', end: 'mapping', startPoint: 'right', endPoint: 'left' },
    { start: 'embed', end: 'similarity', startPoint: 'bottom', endPoint: 'top' },
    { start: 'mapping', end: 'points', startPoint: 'bottom', endPoint: 'top' },
    { start: 'cluster', end: 'clusterinstance', startPoint: 'bottom', endPoint: 'top' },
];

export default function ContentWizard() {
    const { t } = useTranslation();
    const [query, setQuery] = useState<string | undefined>();
    const [options, setOptions] = useState<Options>();
    const [captureOpen, setCaptureOpen] = useState(false);
    const [tags, setTags] = useState<string[] | undefined>();
    const contentSvc = useContentService();
    const [counter, refresh] = useReducer((a) => a + 1, 0);
    const [lines, setLines] = useState<ILine[]>([]);
    const wkspaceRef = useRef<HTMLDivElement>(null);
    const observer = useRef<ResizeObserver>();

    useEffect(() => {
        if (wkspaceRef.current) {
            observer.current = new ResizeObserver(() => {
                if (wkspaceRef.current) {
                    const nodes = extractNodesFromElements(wkspaceRef.current as HTMLElement);
                    setLines(generateLines(nodes, connections));
                }
            });
            observer.current.observe(wkspaceRef.current);
            const children = wkspaceRef.current.children[0]?.children;
            if (children) {
                for (let i = 0; i < children.length; ++i) {
                    const child = children[i];
                    observer.current.observe(child);
                }
            }
            return () => {
                observer.current?.disconnect();
            };
        }
    }, []);

    return (
        <>
            <div className={style.workspace}>
                <div
                    className={style.container}
                    ref={wkspaceRef}
                >
                    <SvgLayer lines={lines} />
                    <QueryGenerator
                        disabled={false}
                        onQuery={(q: string, options: Options) => {
                            setQuery(q);
                            setOptions(options);
                            setTags(undefined);
                            setCaptureOpen(true);
                        }}
                    />
                    <CaptureDialog
                        key={`capture-${counter}`}
                        open={captureOpen}
                        onClose={() => setCaptureOpen(false)}
                        query={query || ''}
                        options={options || {}}
                        onComplete={() => {}}
                        tags={tags}
                    />
                    <ContentSummary
                        onFindMore={(tags) => {
                            // setQuery(tags.join(' '));
                            setTags(tags);
                            setCaptureOpen(true);
                        }}
                    />
                    <EmbeddingTool />
                    <ContentClustering />
                    <MappingTool />
                </div>
            </div>
            <IconMenu
                placement="top"
                label={<div className={style.menuLogo}>{t('creator.titles.creator')}</div>}
            >
                <IconMenuItem tooltip={t('creator.tooltips.resetState')}>
                    <IconButton
                        color="inherit"
                        onClick={refresh}
                    >
                        <RefreshIcon />
                    </IconButton>
                </IconMenuItem>
                <IconMenuItem tooltip={t('creator.tooltips.deleteAll')}>
                    <IconButton
                        color="inherit"
                        onClick={() => contentSvc.reset()}
                    >
                        <BlockIcon />
                    </IconButton>
                </IconMenuItem>
            </IconMenu>
        </>
    );
}
