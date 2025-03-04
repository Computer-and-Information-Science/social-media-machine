import style from './style.module.css';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { SMConfig } from '../../common/state/smConfig';
import EnterUsername from '../../common/components/EnterUsername/EnterUsername';
import ErrorDialog from '../../common/views/ErrorDialog/ErrorDialog';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Privacy, useRandom } from '@knicos/genai-base';
import { appConfiguration } from '@genaism/common/state/configState';
import BlockDialog from '../../common/views/BlockDialog/BlockDialog';
import LangSelect from '@genaism/common/components/LangSelect/LangSelect';
import { contentLoaded, currentUserName } from '@genaism/common/state/sessionState';
import FeedProtocol from '../../protocol/FeedProtocol';
import { TabBlocker } from '@genaism/hooks/duplicateTab';
import { ContentLoader } from '@genaism/common/components/ContentLoader';
import gitInfo from '../../generatedGitInfo.json';
import FlowWrapper from './FlowWrapper';

export function Component() {
    const { code } = useParams();
    const config = useRecoilValue<SMConfig>(appConfiguration);
    const [content, setContent] = useState<(string | ArrayBuffer)[]>();
    const [username, setUsername] = useRecoilState<string | undefined>(currentUserName);
    const setContentLoaded = useSetRecoilState(contentLoaded);

    const MYCODE = useRandom(10);

    const doLoaded = useCallback(() => {
        setContentLoaded(true);
    }, [setContentLoaded]);

    return (
        <>
            <FeedProtocol
                content={content}
                setContent={setContent}
                server={code}
                mycode={MYCODE}
            >
                <main className={style.page}>
                    {config && !username && (
                        <div className={style.language}>
                            <LangSelect />
                        </div>
                    )}
                    {config && !username && (
                        <>
                            <EnterUsername
                                onUsername={(name: string) => {
                                    setUsername(name);
                                }}
                                autoUsername={config.automaticUsername}
                            />
                            <Privacy
                                appName="somekone"
                                tag={gitInfo.gitTag || 'notag'}
                            />
                        </>
                    )}
                    {config && username && (
                        <>
                            <FlowWrapper />
                            <BlockDialog />
                            <Privacy
                                appName="somekone"
                                tag={gitInfo.gitTag || 'notag'}
                            />
                        </>
                    )}
                </main>
            </FeedProtocol>
            <ContentLoader
                content={content}
                onLoaded={doLoaded}
                noConfig
                noSession
            />
            <ErrorDialog />
            <TabBlocker />
        </>
    );
}
