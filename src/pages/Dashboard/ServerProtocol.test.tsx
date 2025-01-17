import { beforeEach, describe, it, vi } from 'vitest';
import ServerProtocol from './ServerProtocol';
import { render } from '@testing-library/react';
import TestWrapper from '@genaism/util/TestWrapper';
import { getGraphService } from '@knicos/genai-recom';

const { mockPeer } = vi.hoisted(() => ({
    mockPeer: vi.fn(),
}));

vi.mock('@knicos/genai-base', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@knicos/genai-base')>()),
    usePeer: mockPeer,
}));

describe('ServerProtocol Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        getGraphService().reset();
    });

    it('responds with ready if connected', async ({ expect }) => {
        mockPeer.mockImplementation(() => ({
            ready: true,
        }));
        const onReady = vi.fn();
        render(
            <TestWrapper>
                <ServerProtocol
                    onReady={onReady}
                    code="xyz"
                    content={[]}
                />
            </TestWrapper>
        );

        expect(mockPeer).toHaveBeenCalled();
        expect(onReady).toHaveBeenCalled();
    });

    it('responds correctly to a new connection', async ({ expect }) => {
        const conn = {
            send: vi.fn(),
        };
        mockPeer.mockImplementation(({ onData }) => {
            onData({ event: 'eter:join' }, conn);
            return { ready: true };
        });

        const onReady = vi.fn();
        render(
            <TestWrapper>
                <ServerProtocol
                    onReady={onReady}
                    code="xyz"
                    content={[]}
                />
            </TestWrapper>
        );

        expect(conn.send).toHaveBeenCalledWith({ event: 'eter:config', configuration: undefined, content: [] });
        expect(conn.send).toHaveBeenCalledWith({ event: 'eter:users', users: [] });
    });
});
