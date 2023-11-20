import { LogEntry } from './profilerTypes';
import { ProfileSummary, UserProfile } from '../profiler/profilerTypes';
import {
    addBiEdge,
    addNode,
    addNodeIfNotExists,
    getNodesByType,
    getRelated,
    addOrAccumulateEdge,
} from '@genaism/services/graph/graph';
import { getTopicId, getTopicLabel } from '@genaism/services/concept/concept';
import { addEdgeTypeListener } from '../graph/events';
import { emitProfileEvent } from '../profiler/events';

let userID: string;

const users = new Map<string, UserProfile>();

const outOfDate = new Set<string>();

addEdgeTypeListener('engaged', (id: string) => {
    if (users.has(id)) {
        outOfDate.add(id);
        emitProfileEvent(id);
    }
});
addEdgeTypeListener('topic', (id: string) => {
    if (users.has(id)) {
        outOfDate.add(id);
        emitProfileEvent(id);
    }
});

export function getCurrentUser(): string {
    if (!userID) newUser();
    return userID;
}

export function setUserName(id: string, name: string) {
    const current = users.get(id) || {
        id,
        name,
        engagedContent: [],
        similarUsers: [],
        taste: [],
        attributes: {},
        engagement: -1,
    };
    users.set(id, { ...current, name });
}

export function addUserProfile(profile: UserProfile) {
    console.log('Adding user', profile.name);
    addNode('user', profile.id);
    profile.engagedContent.forEach((c) => {
        addBiEdge('engaged', profile.id, c.id, c.weight);
    });
    profile.taste.forEach((t) => {
        addBiEdge('topic', profile.id, getTopicId(t.label), t.weight);
    });

    users.set(profile.id, profile);
    outOfDate.add(profile.id);
    emitProfileEvent(profile.id);
}

export function updateProfile(id: string, profile: ProfileSummary) {
    addNodeIfNotExists('user', id);
    profile.engagedContent.forEach((c) => {
        addBiEdge('engaged', id, c.id, c.weight);
    });
    profile.taste.forEach((t) => {
        addBiEdge('topic', id, getTopicId(t.label), t.weight);
    });

    outOfDate.add(id);
    emitProfileEvent(id);
}

export function getUserProfile(id?: string): UserProfile {
    const aid = id || getCurrentUser();
    const profile = users.get(aid);

    if (profile && !outOfDate.has(aid)) return profile;

    console.log('Recreating profile', id, outOfDate);

    const newProfile = recreateUserProfile(aid);
    users.set(aid, newProfile);
    outOfDate.delete(aid);
    return newProfile;
}

export function recreateUserProfile(id?: string): UserProfile {
    const aid = id || getCurrentUser();
    const summary = createProfileSummaryById(aid, 10);
    const state = users.get(aid);
    return {
        ...summary,
        name: state?.name || 'NoName',
        id: aid,
        engagement: -1,
        attributes: {},
    };
}

export function getAllUsers(): string[] {
    return getNodesByType('user');
}

export function findTasteProfileById(id: string, count?: number) {
    return getRelated('topic', id, count).map((v) => ({ label: getTopicLabel(v.id), weight: v.weight }));
}

export function findTopContentById(id: string, count?: number) {
    return getRelated('engaged', id, count);
}

export function findTasteProfile(count?: number) {
    return findTasteProfileById(userID, count);
}

export function findTopContent(count?: number) {
    return findTopContentById(userID, count);
}

export function createProfileSummary(count?: number): ProfileSummary {
    return createProfileSummaryById(getCurrentUser(), count);
}

export function createProfileSummaryById(id: string, count?: number): ProfileSummary {
    const taste = findTasteProfileById(id, count);
    const engagedContent = findTopContentById(id, count);

    return {
        taste,
        engagedContent,
        /*similarUsers: findSimilarUsers(
            id,
            engagedContent,
            taste.map((t) => ({ id: getTopicId(t.label), weight: t.weight }))
        ),*/
    };
}

export function prettyProfile() {
    if (!userID) newUser();

    const topics = getRelated('topic', userID, 10);
    const names = topics.map((t) => `${getTopicLabel(t.id)} (${t.weight.toFixed(1)})`);
    console.log(names);
}

export function newUser() {
    userID = addNode('user');
}

/*function updateParentAffinity(topic: string) {
    const parent = getTopicParent(topic);

    if (parent) {
        const children = getTopicChildren(parent.id);
        const childAffinities = getEdgeWeights(
            'topic',
            userID,
            children.map((c) => c.id)
        );
        const affinity = children.reduce((a, child, ix) => {
            return a + child.weight * childAffinities[ix];
        }, 0);
        addEdge('topic', userID, parent.id, affinity);
        updateParentAffinity(parent.id);
    }
}*/

function affinityBoost(content: string, weight: number) {
    const topics = getRelated('topic', content || '');
    topics.forEach((t) => {
        addOrAccumulateEdge('topic', getCurrentUser(), t.id, t.weight * weight);
    });

    addOrAccumulateEdge('engaged', getCurrentUser(), content, weight);

    // For each parent topic, recalculate user affinity for those topics
    /*topics.forEach((t) => {
        updateParentAffinity(t.id);
    });*/
}

export function addLogEntry(data: LogEntry) {
    switch (data.activity) {
        case 'like':
            affinityBoost(data.id || '', 0.1);
            break;
        case 'laugh':
        case 'anger':
        case 'sad':
        case 'wow':
        case 'love':
            affinityBoost(data.id || '', 0.2);
            break;
        case 'share_public':
            affinityBoost(data.id || '', 0.5);
            break;
        case 'share_private':
            affinityBoost(data.id || '', 0.1);
            break;
        case 'share_friends':
            affinityBoost(data.id || '', 0.3);
            break;
    }
}
