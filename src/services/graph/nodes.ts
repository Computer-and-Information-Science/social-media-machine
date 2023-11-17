import { NodeType } from './graphTypes';
import { edgeSrcIndex, edgeStore, edgeTypeSrcIndex, nodeStore, nodeTypeIndex } from './state';
import { v4 as uuidv4 } from 'uuid';

export function removeNode(id: string) {
    // Remove all edges first.
    const edges = edgeSrcIndex.get(id);
    if (edges) {
        edges.forEach((edge) => {
            const id = `${edge.destination}:${edge.type}:${edge.source}`;
            const srctypeid = `${edge.type}:${edge.source}`;
            edgeStore.delete(id);
            edgeSrcIndex.delete(edge.source);
            edgeTypeSrcIndex.delete(srctypeid);
        });
    }

    const node = nodeStore.get(id);
    if (node) {
        const typeIndex = nodeTypeIndex.get(node.type);
        nodeTypeIndex.set(
            node.type,
            (typeIndex || []).filter((f) => f.id !== id)
        );
        nodeStore.delete(id);
    }
}

export function addNode(type: NodeType, id?: string): string {
    const nid = id ? id : uuidv4();
    if (nodeStore.has(nid)) throw new Error('id_exists');
    const node = { type, id: nid };
    nodeStore.set(nid, node);
    if (!nodeTypeIndex.has(type)) {
        nodeTypeIndex.set(type, []);
    }
    const typeArray = nodeTypeIndex.get(type);
    if (typeArray) typeArray.push(node);
    return nid;
}

export function getNodeType(id: string): NodeType | null {
    const n = nodeStore.get(id);
    return n ? n.type : null;
}

export function getNodesByType(type: NodeType): string[] {
    const nt = nodeTypeIndex.get(type);
    return nt ? nt.map((n) => n.id) : [];
}
