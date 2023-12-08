import { useState, useCallback, useEffect } from 'react';
import style from './style.module.css';
import ImageFeed from '@genaism/components/ImageFeed/ImageFeed';
import { getZipBlob, loadFile } from '@genaism/services/loader/fileLoader';
import { generateFeed } from '@genaism/services/recommender/recommender';
import { LogEntry, ProfileSummary } from '@genaism/services/profiler/profilerTypes';
import { addLogEntry } from '@genaism/services/profiler/profiler';

interface Props {
    content?: (string | ArrayBuffer)[];
    onProfile?: (profile: ProfileSummary) => void;
    onLog?: () => void;
}

export default function Feed({ content, onProfile, onLog }: Props) {
    const [feedList, setFeedList] = useState<string[]>([]);

    const doMore = useCallback(() => {
        const [f, profile] = generateFeed(5);
        setFeedList((old) => [...old, ...f.map((r) => r.contentId)]);
        if (onProfile) onProfile(profile);
    }, [setFeedList, onProfile]);

    const doLog = useCallback(
        (data: LogEntry) => {
            addLogEntry(data);
            if (onLog) onLog();
        },
        [onLog]
    );

    useEffect(() => {
        if (content) {
            content.forEach((c) => {
                getZipBlob(c).then(async (blob) => {
                    await loadFile(blob);
                    const [f, profile] = generateFeed(5);
                    setFeedList((old) => [...old, ...f.map((r) => r.contentId)]);
                    if (onProfile) onProfile(profile);
                });
            });
        }
    }, [content]);

    return (
        <section className={style.feedView}>
            <ImageFeed
                images={feedList}
                onMore={doMore}
                onLog={doLog}
            />

            <div className={style.footerOuter}></div>
        </section>
    );
}
