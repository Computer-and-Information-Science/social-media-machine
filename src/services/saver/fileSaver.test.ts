import { describe, it, vi } from 'vitest';
import { LogEntry, UserProfile } from '../profiler/profilerTypes';
import { saveFile } from './fileSaver';
import JSZip from 'jszip';
import { UserNodeId } from '../graph/graphTypes';

const { mockUsers, mockProfiles, mockSave, mockLog } = vi.hoisted(() => ({
    mockUsers: vi.fn(),
    mockProfiles: vi.fn<unknown[], UserProfile>(),
    mockSave: vi.fn(),
    mockLog: vi.fn<unknown[], LogEntry[]>(),
}));

vi.mock('@genaism/services/graph/nodes', () => ({
    getNodesByType: mockUsers,
}));

vi.mock('@genaism/services/profiler/profiler', () => ({
    getUserProfile: mockProfiles,
    getActionLog: mockLog,
}));

vi.mock('file-saver', () => ({
    saveAs: mockSave,
}));

describe('saveFile()', () => {
    it('generates a zip containing user profiles', async ({ expect }) => {
        mockUsers.mockImplementation(() => ['xyz']);
        mockProfiles.mockImplementation(() => ({
            name: 'TestUser',
            id: 'user:xyz' as UserNodeId,
            engagement: -1,
            engagedContent: [],
            commentedTopics: [],
            reactedTopics: [],
            sharedTopics: [],
            followedTopics: [],
            seenTopics: [],
            viewedTopics: [],
            taste: [],
            attributes: {},
        }));

        const blob = await saveFile(false, true, false);

        expect(mockUsers).toHaveBeenCalledTimes(1);
        expect(mockProfiles).toHaveBeenCalledWith('xyz');
        expect(mockSave).toHaveBeenCalledTimes(1);

        const zip = await JSZip.loadAsync(blob);
        expect(zip.files).toHaveProperty('users.json');
        expect(zip.files['users.json'].name).toBe('users.json');

        const data = JSON.parse(await zip.files['users.json'].async('string'));
        expect(data).toHaveLength(1);
        expect(data[0].name).toBe('TestUser');
    });

    it('generates a zip containing action logs', async ({ expect }) => {
        mockUsers.mockImplementation(() => ['xyz']);
        mockLog.mockImplementation(() => [{ activity: 'like', timestamp: 1 }] as LogEntry[]);

        const blob = await saveFile(false, false, true);

        expect(mockUsers).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledWith('xyz');
        expect(mockSave).toHaveBeenCalledTimes(1);

        const zip = await JSZip.loadAsync(blob);
        expect(zip.files).toHaveProperty('logs.json');
        expect(zip.files['logs.json'].name).toBe('logs.json');

        const data = JSON.parse(await zip.files['logs.json'].async('string'));
        expect(data).toHaveLength(1);
        expect(data[0].id).toBe('xyz');
        expect(data[0].log).toHaveLength(1);
    });
});
