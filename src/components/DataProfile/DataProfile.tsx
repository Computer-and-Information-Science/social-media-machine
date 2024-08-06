import ImageCloud from '../ImageCloud/ImageCloud';
import { useCallback, useState } from 'react';
import ActionLogTable from '../ActionLogTable/ActionLogTable';
import style from './style.module.css';
import { UserNodeId } from '@knicos/genai-recom';
import { useUserProfile } from '@genaism/hooks/profiler';
import { useProfilerService } from '@genaism/hooks/services';
import { useActionLog } from '@genaism/hooks/actionLog';

interface Props {
    id?: UserNodeId;
}

export default function Profile({ id }: Props) {
    const [wcSize, setWCSize] = useState(300);
    const profile = useUserProfile(id);
    const profiler = useProfilerService();
    const log = useActionLog(id || profiler.getCurrentUser());

    const doResize = useCallback((size: number) => {
        setWCSize(size);
    }, []);

    return (
        <div className={style.outerContainer}>
            <div
                className={style.container}
                tabIndex={0}
            >
                <div>
                    <svg
                        width="100%"
                        height="300px"
                        viewBox={`${-(wcSize * 1.67)} ${-wcSize} ${wcSize * 1.67 * 2} ${wcSize * 2}`}
                    >
                        <ImageCloud
                            content={profile.affinities.contents.contents}
                            size={300}
                            onSize={doResize}
                        />
                    </svg>
                </div>
                <ActionLogTable
                    user={id || profiler.getCurrentUser()}
                    log={log}
                />
            </div>
        </div>
    );
}
