import { useNodeType } from '@genaism/services/graph/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Graph from '../Graph/Graph';
import { GraphLink, GraphNode, InternalGraphLink } from '../Graph/types';
import { TopicNodeId, WeightedNode } from '@genaism/services/graph/graphTypes';
import TopicNode from './TopicNode';
import { topicUserSimilarity } from './similarity';
import {
    settingTopicDisplayLines,
    settingTopicLinkDistanceScale,
    settingTopicNodeCharge,
} from '@genaism/state/settingsState';
import { useRecoilValue } from 'recoil';

export default function TopicGraph() {
    const [links, setLinks] = useState<GraphLink<TopicNodeId, TopicNodeId>[]>([]);
    const sizesRef = useRef<Map<string, number>>(new Map<string, number>());
    const [nodes, setNodes] = useState<GraphNode<TopicNodeId>[]>([]);
    const linkScale = useRecoilValue(settingTopicLinkDistanceScale);
    const showLines = useRecoilValue(settingTopicDisplayLines);
    const charge = useRecoilValue(settingTopicNodeCharge);
    const topics = useNodeType('topic');

    const similar = useMemo(() => {
        const results = new Map<TopicNodeId, WeightedNode<TopicNodeId>[]>();
        topics.forEach((topic) => {
            results.set(topic, topicUserSimilarity(topic));
        });
        return results;
    }, [topics]);

    const [focusNode, setFocusNode] = useState<string | undefined>();
    const [zoom, setZoom] = useState(5);
    const [center, setCenter] = useState<[number, number] | undefined>();

    const doRedrawNodes = useCallback(() => {
        const filteredTopics = topics.filter((t) => (similar.get(t)?.length || 0) > 0);

        setNodes(
            filteredTopics.map((u) => ({
                id: u,
                size: sizesRef.current.get(u) || 20,
            }))
        );
        // Create some links
        const links: GraphLink<TopicNodeId, TopicNodeId>[] = [];

        let maxLink = 0;

        filteredTopics.forEach((source) => {
            const similarNodes = similar.get(source);
            if (similarNodes) {
                similarNodes.forEach((target) => {
                    if (target.weight > 0 && source !== target.id) {
                        links.push({ source, target: target.id, strength: target.weight });
                        maxLink = Math.max(maxLink, target.weight);
                    }
                });
            }
        });

        links.forEach((l) => {
            l.strength /= maxLink;
        });

        setLinks(links);
    }, [topics]);

    const doResize = useCallback(
        (id: string, size: number) => {
            sizesRef.current.set(id, size);
            doRedrawNodes();
        },
        [doRedrawNodes]
    );

    useEffect(() => {
        doRedrawNodes();
    }, [doRedrawNodes]);

    return (
        <Graph
            links={links}
            nodes={nodes}
            linkScale={linkScale}
            charge={charge}
            showLines={showLines}
            onSelect={(n: Readonly<GraphNode<TopicNodeId>>) => {
                if (!focusNode) setZoom(3);
                setCenter([n.x || 0, n.y || 0]);
                setFocusNode(n.id);
            }}
            onUnselect={() => {
                setFocusNode(undefined);
                setZoom(5);
                setCenter([0, 0]);
            }}
            focusNode={focusNode}
            zoom={zoom}
            center={center}
            defaultLinkStyle={{
                opacity: (l: InternalGraphLink<TopicNodeId, TopicNodeId>) => l.strength * 0.9,
                width: (l: InternalGraphLink<TopicNodeId, TopicNodeId>) => 1 + Math.floor(l.strength * 60),
            }}
        >
            {nodes.map((n) => (
                <TopicNode
                    id={n.id}
                    key={n.id}
                    selected={n.id === focusNode}
                    onResize={doResize}
                />
            ))}
        </Graph>
    );
}
