import { describe, it, beforeEach } from 'vitest';
import { addEdge, getEdgeWeights, getEdges, getEdgesOfType } from './edges';
import { edgeStore, resetGraph } from './state';
import { addNode } from './nodes';

describe('graph.addEdge', () => {
    beforeEach(() => resetGraph());

    it('updates the edges store', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id = addEdge('liked', id1, id2, 3.0);
        expect(id).toBeTypeOf('string');
        expect(id && edgeStore.has(id)).toBe(true);
    });

    it('fails if source node does not exist', async ({ expect }) => {
        const id2 = addNode('content');
        const id = addEdge('liked', 'randomnode', id2, 3.0);
        expect(id).toBe(null);
    });

    it('fails if destination node does not exist', async ({ expect }) => {
        const id2 = addNode('content');
        const id = addEdge('liked', id2, 'randomnode', 3.0);
        expect(id).toBe(null);
    });
});

describe('graph.getEdgeWeights', () => {
    it('returns a single weight for one edge', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('liked', id1, id3, 4.0);

        const w = getEdgeWeights('liked', id1, id2);
        expect(w).toHaveLength(1);
        expect(w[0]).toBe(3);
    });

    it('returns a multiple weights', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('liked', id1, id3, 4.0);

        const w = getEdgeWeights('liked', id1);
        expect(w).toHaveLength(2);
        expect(w).toContain(3);
        expect(w).toContain(4);
    });

    it('returns specified weights', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        const id4 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('liked', id1, id3, 4.0);
        addEdge('liked', id1, id4, 2.0);

        const w = getEdgeWeights('liked', id1, [id2, id3]);
        expect(w).toHaveLength(2);
        expect(w).toContain(3);
        expect(w).toContain(4);
    });
});

describe('graph.getEdges', () => {
    it('returns all edges for one node', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('engaged', id1, id3, 4.0);

        const edges = getEdges(id1);
        expect(edges).toHaveLength(2);
    });

    it('returns all edges for all nodes', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('engaged', id1, id3, 4.0);
        addEdge('comment', id2, id3, 4.0);

        const edges = getEdges([id1, id2]);
        expect(edges).toHaveLength(3);
    });

    it('returns no edges for nodes without edges', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('engaged', id1, id3, 4.0);

        const edges = getEdges(id3);
        expect(edges).toHaveLength(0);
    });
});

describe('graph.getEdgesOfType', () => {
    it('gives all edges of one type for one node', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        const id4 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('liked', id1, id4, 3.0);
        addEdge('engaged', id1, id3, 4.0);

        const edges = getEdgesOfType('liked', id1);
        expect(edges).toHaveLength(2);
        expect(edges[0].destination).toBe(id2);
        expect(edges[1].destination).toBe(id4);
    });

    it('gives all edges of specified types for one node', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        const id4 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('comment', id1, id4, 3.0);
        addEdge('engaged', id1, id3, 4.0);

        const edges = getEdgesOfType(['liked', 'comment'], id1);
        expect(edges).toHaveLength(2);
        expect(edges[0].destination).toBe(id2);
        expect(edges[1].destination).toBe(id4);
    });

    it('gives all edges of specified types for specified nodes', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        const id4 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('comment', id1, id4, 3.0);
        addEdge('liked', id2, id3, 4.0);
        addEdge('liked', id3, id4, 4.0);

        const edges = getEdgesOfType(['liked', 'comment'], [id1, id2]);
        expect(edges).toHaveLength(3);
    });

    it('gives all edges of one type for specified nodes', async ({ expect }) => {
        const id1 = addNode('content');
        const id2 = addNode('content');
        const id3 = addNode('content');
        const id4 = addNode('content');
        addEdge('liked', id1, id2, 3.0);
        addEdge('comment', id1, id4, 3.0);
        addEdge('liked', id2, id3, 4.0);
        addEdge('liked', id3, id4, 4.0);

        const edges = getEdgesOfType('liked', [id1, id2]);
        expect(edges).toHaveLength(2);
    });
});
