import EE from 'eventemitter3';

const ee = new EE();

export function addProfileListener(id: string, handler: () => void) {
    ee.on(`profile-${id}`, handler);
}

export function removeProfileListener(id: string, handler: () => void) {
    ee.off(`profile-${id}`, handler);
}

export function emitProfileEvent(id: string) {
    ee.emit(`profile-${id}`);
}
