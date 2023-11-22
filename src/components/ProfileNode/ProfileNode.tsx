import ImageCloud from '../ImageCloud/ImageCloud';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserProfile } from '@genaism/services/profiler/hooks';
import { useSimilarUsers } from '@genaism/services/users/users';
import { GraphLink } from '../Graph/Graph';
import { WeightedNode } from '@genaism/services/graph/graphTypes';
import { useRecoilValue } from 'recoil';
import { settingDisplayLabel, settingShrinkOfflineUsers } from '@genaism/state/settingsState';

interface Props {
    id: string;
    live?: boolean;
    onLinks: (id: string, links: GraphLink[]) => void;
    onResize: (id: string, size: number) => void;
}

export default function ProfileNode({ id, onLinks, onResize, live }: Props) {
    const [size, setSize] = useState(100);
    const simRef = useRef<WeightedNode[]>();
    const showLabel = useRecoilValue(settingDisplayLabel);
    const shrinkOffline = useRecoilValue(settingShrinkOfflineUsers);

    const profile = useUserProfile(id);
    const similar = useSimilarUsers(profile);

    const doResize = useCallback(
        (s: number) => {
            setSize(s + 20);
            onResize(id, s + 20);
        },
        [onResize, id]
    );

    useEffect(() => {
        if (simRef.current !== similar) {
            simRef.current = similar;
            onLinks(
                id,
                similar.map((s) => ({ source: id, target: s.id, strength: s.weight }))
            );
        }
    }, [similar, onLinks]);

    return (
        <>
            <circle
                data-testid="profile-circle"
                r={size}
                fill="white"
                stroke={live ? '#0A869A' : '#888'}
                strokeWidth={shrinkOffline && !live ? 5 : 10}
            />
            {profile.engagedContent.length > 0 && (
                <ImageCloud
                    content={profile.engagedContent}
                    size={shrinkOffline && !live ? 100 : 300}
                    padding={3}
                    onSize={doResize}
                />
            )}
            {showLabel && (
                <text
                    y={-size - 5}
                    textAnchor="middle"
                >
                    {profile.name}
                </text>
            )}
        </>
    );
}
