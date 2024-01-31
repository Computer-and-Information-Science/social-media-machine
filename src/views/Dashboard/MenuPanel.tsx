import { IconButton } from '@mui/material';
import style from './style.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { menuShowSettings, menuShowShare } from '@genaism/state/menuState';
import { useTranslation } from 'react-i18next';
import IconMenu from '@genaism/components/IconMenu/IconMenu';
import IconMenuItem from '@genaism/components/IconMenu/Item';
import Spacer from '@genaism/components/IconMenu/Spacer';
import AppMenu from './AppMenu';
import ViewMenu from './ViewMenu';
import StorageMenu from './StorageMenu';
import { appConfiguration } from '@genaism/state/settingsState';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface Props {
    onOpen?: (data: Blob) => void;
    onRefresh?: () => void;
}

export default function MenuPanel({ onOpen, onRefresh }: Props) {
    const { t } = useTranslation();
    const [showShare, setShowShare] = useRecoilState(menuShowShare);
    const [showSettings, setShowSettings] = useRecoilState(menuShowSettings);
    const [config, setConfig] = useRecoilState(appConfiguration);

    const doShowShare = useCallback(() => setShowShare((s) => !s), [setShowShare]);
    const doShowSettings = useCallback(() => setShowSettings((s) => !s), [setShowSettings]);

    const doOpenFile = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.files && onOpen) {
                onOpen(e.currentTarget.files[0]);
                e.currentTarget.value = '';
            }
        },
        [onOpen]
    );

    return (
        <IconMenu
            placement="left"
            label={
                <div className={style.logo}>
                    <img
                        src="/logo48_bw_invert.png"
                        width="48"
                        height="48"
                    />
                </div>
            }
        >
            <IconMenuItem tooltip={t('dashboard.labels.shareTip')}>
                <IconButton
                    color={showShare ? 'secondary' : 'inherit'}
                    onClick={doShowShare}
                >
                    <QrCode2Icon />
                </IconButton>
            </IconMenuItem>
            <IconMenuItem tooltip={t('dashboard.labels.disableFeedApp')}>
                <IconButton
                    color={config?.disableFeedApp ? 'secondary' : 'inherit'}
                    onClick={() => setConfig((old) => ({ ...old, disableFeedApp: !old.disableFeedApp }))}
                >
                    {config?.disableFeedApp ? <PlayCircleIcon /> : <PauseIcon />}
                </IconButton>
            </IconMenuItem>
            <ViewMenu />
            <AppMenu />
            <Spacer />
            <StorageMenu />
            <IconMenuItem tooltip={t('dashboard.labels.refreshGraph')}>
                <IconButton
                    color={'inherit'}
                    onClick={onRefresh}
                >
                    <RefreshIcon />
                </IconButton>
            </IconMenuItem>
            <IconMenuItem tooltip="">
                <IconButton
                    color={showSettings ? 'secondary' : 'inherit'}
                    onClick={doShowSettings}
                >
                    <SettingsIcon />
                </IconButton>
            </IconMenuItem>
            <input
                type="file"
                id="openfile"
                onChange={doOpenFile}
                hidden={true}
                accept=".zip,application/zip"
            />
        </IconMenu>
    );
}
