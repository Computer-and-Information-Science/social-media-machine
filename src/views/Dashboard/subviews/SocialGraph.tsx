import SocialGraph from '@genaism/components/SocialGraph/SocialGraph';
import { useEventListen } from '@genaism/hooks/events';
import { menuSelectedUser } from '@genaism/state/menuState';
import { useEffect, useReducer } from 'react';
import { useSetRecoilState } from 'recoil';

export function Component() {
    const [count, refresh] = useReducer((a) => ++a, 0);
    useEventListen('refresh_graph', () => {
        refresh();
    });

    const setSelectedNode = useSetRecoilState(menuSelectedUser);
    useEffect(() => {
        setSelectedNode(undefined);
    }, [setSelectedNode]);

    return <SocialGraph key={`k-${count}`} />;
}
