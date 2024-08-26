import UserTable from '@genaism/components/Tables/UserTable';
import { useEventListen } from '@genaism/hooks/events';
import { useReducer } from 'react';

export function Component() {
    const [count, refresh] = useReducer((a) => ++a, 0);
    useEventListen('refresh_graph', () => {
        refresh();
    });

    return <UserTable key={`k-${count}`} />;
}
