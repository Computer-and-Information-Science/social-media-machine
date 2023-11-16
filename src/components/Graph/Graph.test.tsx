import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Graph from './Graph';

describe('Graph component', () => {
    it('renders with no nodes', async ({ expect }) => {
        render(<Graph nodes={[]} />);

        expect(screen.getByTestId('graph-svg')).toBeInTheDocument();
    });

    it('renders with one node', async ({ expect }) => {
        render(<Graph nodes={[{ id: 'xyz', size: 50, component: <text data-testid="graph-node-1">Hello</text> }]} />);

        expect(screen.getByTestId('graph-node-1')).toBeInTheDocument();
    });

    it('renders with several nodes', async ({ expect }) => {
        render(
            <Graph
                nodes={[
                    { id: 'xyz', size: 50, component: <text data-testid="graph-node-1">Hello</text> },
                    { id: 'xyz2', size: 60, component: <text data-testid="graph-node-2">Hello2</text> },
                    { id: 'xyz3', size: 70, component: <text data-testid="graph-node-3">Hello3</text> },
                ]}
            />
        );

        expect(screen.getByTestId('graph-node-1')).toBeInTheDocument();
        expect(screen.getByTestId('graph-node-2')).toBeInTheDocument();
        expect(screen.getByTestId('graph-node-3')).toBeInTheDocument();
    });

    it('renders the link lines', async ({ expect }) => {
        render(
            <Graph
                nodes={[
                    { id: 'xyz', size: 50, component: <text data-testid="graph-node-1">Hello</text> },
                    { id: 'xyz2', size: 60, component: <text data-testid="graph-node-2">Hello2</text> },
                    { id: 'xyz3', size: 70, component: <text data-testid="graph-node-3">Hello3</text> },
                ]}
                links={[{ source: 'xyz', target: 'xyz1' }]}
            />
        );

        expect(screen.getByTestId('graph-link-0')).toBeInTheDocument();
    });
});
