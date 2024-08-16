import { useState, useCallback, useEffect, useRef } from 'react';
import style from './style.module.css';
import ImageFeed, { FeedEntry } from '@genaism/components/ImageFeed/ImageFeed';
import { useRecoilValue } from 'recoil';
import { configuration } from '@genaism/state/settingsState';
import { LogEntry, ScoredRecommendation, UserNodeData, UserNodeId } from '@knicos/genai-recom';
import { useActionLogService, useProfilerService } from '@genaism/hooks/services';
import { useRecommendations } from '@genaism/hooks/recommender';
import { contentLoaded, injectedContent } from '@genaism/state/sessionState';

interface Props {
    id?: UserNodeId;
    onProfile?: (profile: UserNodeData) => void;
    onRecommend?: (recommendations: ScoredRecommendation[]) => void;
    onLog?: () => void;
    noLog?: boolean;
    noActions?: boolean;
}

export default function Feed({ onProfile, onLog, onRecommend, id, noLog, noActions }: Props) {
    const [feedList, setFeedList] = useState<FeedEntry[]>([]);
    const moreState = useRef(true);
    const profiler = useProfilerService();
    const aid = id || profiler.getCurrentUser();
    const appConfig = useRecoilValue(configuration(aid));
    const { recommendations, more } = useRecommendations(5, aid, appConfig?.recommendations);
    const actionLog = useActionLogService();
    const contentReady = useRecoilValue(contentLoaded);
    const injections = useRecoilValue(injectedContent);
    const injectTime = useRef(Date.now());

    useEffect(() => {
        if (moreState.current && recommendations.length > 0) {
            const toInject = injections
                .filter((i) => i.timestamp > injectTime.current)
                .map((i) => ({ contentId: i.content, injection: i }));
            setFeedList((old) => [
                ...old,
                ...toInject,
                ...recommendations.map((r) => ({ contentId: r.contentId, recommendation: r })),
            ]);
            injectTime.current = Date.now();
            moreState.current = false;
            if (onRecommend) onRecommend(recommendations);
            if (onProfile) onProfile(profiler.getUserProfile(aid));
        } else if (moreState.current) {
            setTimeout(more, 2000);
        }
    }, [recommendations, onProfile, onRecommend, profiler, aid, more, injections]);

    const doLog = useCallback(
        (data: LogEntry) => {
            if (!noLog) {
                actionLog.addLogEntry(data, aid);
                if (onLog) onLog();
            }
        },
        [onLog, noLog, actionLog, aid]
    );

    useEffect(() => {
        if (contentReady) more();
    }, [more, contentReady]);

    return (
        <section className={style.feedView}>
            <ImageFeed
                images={feedList}
                onMore={() => {
                    moreState.current = true;
                    more();
                }}
                onLog={doLog}
                noActions={noActions}
                showLabels={appConfig?.showTopicLabels}
                alwaysActive={appConfig?.alwaysActive}
            />

            <div className={style.footerOuter}></div>
        </section>
    );
}
