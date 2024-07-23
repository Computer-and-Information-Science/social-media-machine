import { ContentNodeId, UserNodeId, WeightedNode } from '@genaism/services/graph/graphTypes';
import { configuration } from '@genaism/state/settingsState';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { heatmapImageSet, heatmapScores } from '../RecommendationsHeatmap/algorithm';
import Heatmap from '../Heatmap/Heatmap';

interface Props {
    user: UserNodeId;
    dimensions: number;
}

export default function RecommendationsHeatmap({ user, dimensions }: Props) {
    const config = useRecoilValue(configuration(user));
    const images = useRef<ContentNodeId[]>();
    const [heats, setHeats] = useState<WeightedNode<ContentNodeId>[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (!images.current) {
            images.current = heatmapImageSet(dimensions);
        }

        heatmapScores(images.current, user, config).then((scored) => {
            setHeats(scored);
            setLoading(false);
        });
    }, [dimensions, user, config]);

    return (
        <Heatmap
            data={loading ? undefined : heats}
            dimensions={dimensions}
        />
    );
}
