import { IconButton } from '@mui/material';
import IconMenu from '../IconMenu/IconMenu';
import IconMenuItem from '../IconMenu/Item';
import CollectionsIcon from '@mui/icons-material/Collections';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PersonIcon from '@mui/icons-material/Person';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Spacer from '../IconMenu/Spacer';
import style from './style.module.css';
import { useTranslation } from 'react-i18next';
import { removeNode } from '@genaism/services/graph/nodes';
import { useRecoilState, useRecoilValue } from 'recoil';
import { settingNodeMode } from '@genaism/state/settingsState';
import { useEffect, useRef, useState } from 'react';
import DeleteDialog from '../SocialGraph/DeleteDialog';
import { menuNodeSelectAction, menuSelectedUser, menuShowGridMenu, menuShowUserPanel } from '@genaism/state/menuState';
import { UserNodeId } from '@genaism/services/graph/graphTypes';
import { getUserData } from '@genaism/services/users/users';

export default function GridMenu() {
    const { t } = useTranslation();
    const [nodeMode, setNodeMode] = useRecoilState(settingNodeMode);
    const [showDelete, setShowDelete] = useState(false);
    const [panel, setPanel] = useRecoilState(menuShowUserPanel);
    const selectedUser = useRecoilValue(menuSelectedUser);
    const showMenu = useRecoilValue(menuShowGridMenu);
    const selectAction = useRecoilValue(menuNodeSelectAction);
    const userRef = useRef<UserNodeId | undefined>();

    useEffect(() => {
        if (selectedUser && selectedUser !== userRef.current && selectAction !== 'none') {
            setPanel(selectAction);
        }
        userRef.current = selectedUser;
    }, [selectedUser, selectAction, setPanel]);

    if (!showMenu) return null;

    return (
        <IconMenu
            placement="top"
            selected={!!selectedUser}
            label={
                <div className={style.menuLogo}>
                    {selectedUser ? getUserData(selectedUser)?.name : t('dashboard.titles.people')}
                </div>
            }
        >
            <IconMenuItem tooltip={t('dashboard.labels.engagedImages')}>
                <IconButton
                    color={nodeMode === 'image' ? 'secondary' : 'inherit'}
                    onClick={() => setNodeMode('image')}
                    data-testid="social-menu-images"
                    aria-label={t('dashboard.labels.engagedImages')}
                >
                    <CollectionsIcon />
                </IconButton>
            </IconMenuItem>
            <IconMenuItem tooltip={t('dashboard.labels.topicCloud')}>
                <IconButton
                    color={nodeMode === 'word' ? 'secondary' : 'inherit'}
                    onClick={() => setNodeMode('word')}
                    aria-label={t('dashboard.labels.topicCloud')}
                >
                    <TextFieldsIcon />
                </IconButton>
            </IconMenuItem>
            {selectedUser && (
                <>
                    <Spacer />
                    <IconMenuItem tooltip={t('dashboard.labels.showFeed')}>
                        <IconButton
                            data-testid="social-menu-feed-button"
                            color={panel === 'feed' ? 'secondary' : 'inherit'}
                            onClick={() => setPanel('feed')}
                            aria-label={t('dashboard.labels.showFeed')}
                        >
                            <PhoneAndroidIcon />
                        </IconButton>
                    </IconMenuItem>
                    <IconMenuItem tooltip={t('dashboard.labels.showData')}>
                        <IconButton
                            data-testid="social-menu-data-button"
                            color={panel === 'data' ? 'secondary' : 'inherit'}
                            onClick={() => setPanel('data')}
                            aria-label={t('dashboard.labels.showData')}
                        >
                            <QueryStatsIcon />
                        </IconButton>
                    </IconMenuItem>
                    <IconMenuItem tooltip={t('dashboard.labels.showProfile')}>
                        <IconButton
                            data-testid="social-menu-profile-button"
                            color={panel === 'profile' ? 'secondary' : 'inherit'}
                            onClick={() => setPanel('profile')}
                            aria-label={t('dashboard.labels.showProfile')}
                        >
                            <PersonIcon />
                        </IconButton>
                    </IconMenuItem>
                    <IconMenuItem tooltip={t('dashboard.labels.showRecommendations')}>
                        <IconButton
                            data-testid="social-menu-recom-button"
                            color={panel === 'recommendations' ? 'secondary' : 'inherit'}
                            onClick={() => setPanel('recommendations')}
                            aria-label={t('dashboard.labels.showRecommendations')}
                        >
                            <ImageSearchIcon />
                        </IconButton>
                    </IconMenuItem>
                    <Spacer />
                    <IconMenuItem tooltip={t('dashboard.labels.deleteUser')}>
                        <IconButton
                            color="inherit"
                            onClick={() => setShowDelete(true)}
                            aria-label={t('dashboard.labels.deleteUser')}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </IconMenuItem>
                    <DeleteDialog
                        name={getUserData(selectedUser)?.name || 'No Name'}
                        open={showDelete}
                        onClose={() => setShowDelete(false)}
                        onDelete={() => {
                            removeNode(selectedUser);
                            setShowDelete(false);
                        }}
                    />
                </>
            )}
        </IconMenu>
    );
}
