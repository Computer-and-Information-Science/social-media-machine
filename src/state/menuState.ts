import { atom } from 'recoil';

export const menuShowShare = atom<boolean>({
    key: 'menushowshare',
    default: false,
});

export const menuShowSave = atom<boolean>({
    key: 'menushowsave',
    default: false,
});

export const menuShowSettings = atom<boolean>({
    key: 'menushowsettings',
    default: false,
});
