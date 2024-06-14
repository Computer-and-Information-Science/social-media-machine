import { ContentNodeId, UserNodeId, WeightedNode } from '@genaism/services/graph/graphTypes';
import { Recommendation } from '../recommenderTypes';
import { biasedUniqueSubset } from '@genaism/util/subsets';
import { UserNodeData } from '@genaism/services/users/userTypes';
import { getSimilarUsers } from '@genaism/services/similarity/user';
import { getUserData } from '@genaism/services/users/users';

const NUM_SIMILAR_USERS = 5;

interface UserSuggestion extends WeightedNode<ContentNodeId> {
    user: UserNodeId;
    similarityScore: number;
}

// FIXME: Select different numbers of candidates from the similar users depending upon their weight. More
// candidates should come from those more similar users. Also, use biasedUniqueSubset to randomly select N from the
// larger set to avoid only ever considering the most recent ones. What are the performance implications of this?

export function generateSimilarUsers(profile: UserNodeData, nodes: Recommendation[], count: number) {
    // First, find similar users.
    //const similar = getRelated('similar', profile.id, { count: NUM_SIMILAR_USERS, timeDecay: 0.5, period: MIN20 });
    const similar = getSimilarUsers(profile.embeddings.taste, NUM_SIMILAR_USERS).filter(
        (s) => s.id !== profile.id && s.weight > 0
    );

    // For each similar user, get their favourite images.
    let results: UserSuggestion[] = [];
    similar.forEach((user) => {
        const best = getUserData(user.id)?.affinities.contents.contents || [];
        const wbest = best.map((b) => ({
            id: b.id,
            weight: b.weight * user.weight,
            user: user.id,
            similarityScore: user.weight,
        }));
        results = [...results, ...wbest];
    });

    results.sort((a, b) => b.weight - a.weight);
    const final = biasedUniqueSubset(results, count, (v) => v.id);
    final.forEach((r) => {
        nodes.push({
            contentId: r.id,
            candidateOrigin: 'similar_user',
            timestamp: Date.now(),
            similarUser: r.user,
            userSimilarityScore: r.similarityScore,
        });
    });
}
