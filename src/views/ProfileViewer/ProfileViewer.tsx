import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import ErrorDialog from '../dialogs/ErrorDialog/ErrorDialog';
import useRandom from '@genaism/hooks/random';
import { useTranslation } from 'react-i18next';
import DataProfile from '@genaism/components/DataProfile/DataProfile';
import { useRecoilValue } from 'recoil';
import { BottomNavigation, BottomNavigationAction, Slide, SlideProps } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PersonIcon from '@mui/icons-material/Person';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import UserProfile from '@genaism/components/UserProfile/UserProfile';
import style from './style.module.css';
import { appConfiguration } from '@genaism/state/settingsState';
import { SMConfig } from '../Genagram/smConfig';
import { UserNodeId } from '@genaism/services/graph/graphTypes';
import RecommendationsProfile from '@genaism/components/RecommendationsProfile/RecommendationsProfile';
import EnterName from './EnterName';
import BlockDialog from '../dialogs/BlockDialog/BlockDialog';
import ViewerProtocol from './ViewerProtocol';

function slideDirection(my: number, current: number, previous: number): SlideProps['direction'] {
    if (my === current) {
        if (previous < current) return 'left';
        return 'right';
    } else {
        if (previous < current) return 'right';
        return 'left';
    }
}

export function Component() {
    const { t } = useTranslation();
    const { code } = useParams();
    const [id, setID] = useState<UserNodeId>();
    const MYCODE = useRandom(10);
    const [page, setPage] = useState(0);
    const prevPage = useRef(0);
    const config = useRecoilValue<SMConfig>(appConfiguration);
    const [name, setName] = useState<string>();

    return (
        <>
            <ViewerProtocol
                server={code}
                mycode={MYCODE}
                onID={setID}
            >
                {(!config?.collectResearchData || name) && (
                    <div className={style.container}>
                        <Slide
                            direction={slideDirection(0, page, prevPage.current)}
                            in={page === 0}
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className={style.pageContainer}>
                                <DataProfile id={id} />
                            </div>
                        </Slide>
                        <Slide
                            direction={slideDirection(1, page, prevPage.current)}
                            in={page === 1}
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className={style.pageContainer}>
                                <UserProfile id={id} />
                            </div>
                        </Slide>
                        <Slide
                            direction={slideDirection(2, page, prevPage.current)}
                            in={page === 2}
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className={style.pageContainer}>
                                <RecommendationsProfile id={id} />
                            </div>
                        </Slide>
                        <BottomNavigation
                            showLabels
                            value={page}
                            onChange={(_, newValue) =>
                                setPage((old) => {
                                    prevPage.current = old;
                                    return newValue;
                                })
                            }
                        >
                            <BottomNavigationAction
                                label={t('profile.actions.data')}
                                icon={<QueryStatsIcon fontSize="large" />}
                            />
                            <BottomNavigationAction
                                disabled={config?.hideProfileView}
                                label={t('profile.actions.profile')}
                                icon={<PersonIcon fontSize="large" />}
                            />
                            <BottomNavigationAction
                                disabled={config?.hideRecommendationsView}
                                label={t('profile.actions.recommendations')}
                                icon={<ImageSearchIcon fontSize="large" />}
                            />
                        </BottomNavigation>
                        <BlockDialog />
                    </div>
                )}
                {id && config?.collectResearchData && !name && (
                    <div className={style.container}>
                        <EnterName
                            onName={setName}
                            hostUser={id}
                        />
                    </div>
                )}
                <span></span>
            </ViewerProtocol>
            <ErrorDialog />
        </>
    );
}
