import { useMemo, useRef, useState } from 'react';
import { Button } from '@knicos/genai-base';
import { useTranslation } from 'react-i18next';
import Cards from '../DataCard/Cards';
import LogBatch from './LogBatch';
import style from './style.module.css';
import { GraphService, LogEntry, UserNodeId } from '@knicos/genai-recom';
import { useGraphService, useProfilerService } from '@genaism/hooks/services';

interface Props {
    user?: UserNodeId;
    log: LogEntry[];
}

function batchLogs(
    graph: GraphService,
    user: UserNodeId,
    log: LogEntry[],
    size: number,
    startOffset: number
): LogEntry[][] {
    const results: LogEntry[][] = [[]];
    if (log.length === 0) return results;

    if (log[0].activity !== 'engagement') {
        const weight = graph.getEdgeWeights('last_engaged', user, log[0].id)[0] || 0;
        results[0].push({
            activity: 'engagement',
            timestamp: log[0].timestamp,
            value: weight,
            id: log[0].id,
        });
    }

    let counter = size;
    for (let i = 0; i < log.length; ++i) {
        const l = log[i];

        const current = results[results.length - 1];

        if (current.length > 0 && current[0].id !== l.id) {
            if (i >= startOffset) --counter;
            if (counter === 0) break;
            results.push([l]);
        } else {
            current.push(l);
        }
    }
    return results;
}

export default function ActionLogTable({ user, log }: Props) {
    const { t } = useTranslation();
    const [size, setSize] = useState(5);
    const firstSize = useRef(log.length);
    const graph = useGraphService();
    const profiler = useProfilerService();

    const logLimited = useMemo(() => {
        return batchLogs(graph, user || profiler.getCurrentUser(), log, size, log.length - firstSize.current);
    }, [log, size, user, profiler, graph]);

    return (
        <Cards>
            {logLimited.map((batch, ix) => (
                <LogBatch
                    batch={batch}
                    key={logLimited.length - ix}
                />
            ))}
            <li className={style.buttonListItem}>
                <Button
                    variant="outlined"
                    onClick={() => setSize((s) => s + 5)}
                    sx={{ margin: '1rem 0.5rem' }}
                >
                    {t('profile.actions.more')}
                </Button>
            </li>
        </Cards>
    );
}
