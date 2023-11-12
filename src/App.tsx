import React from 'react';
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    useRouteError,
    Navigate,
} from 'react-router-dom';
import './App.css';

interface RouterError {
    status: number;
}

function ErrorComponent() {
    const error = useRouteError();

    if ((error as RouterError).status === 404) {
        return (
            <section className="errorView">
                <h1>Page not found</h1>
            </section>
        );
    }

    return (
        <section className="errorView">
            <h1>Something went wrong</h1>
            <p>
                Please report this issue to{' '}
                <a
                    href="https://github.com/knicos/genai-tm/issues"
                    target="_blank"
                    rel="noreferrer"
                >
                    our project on github
                </a>{' '}
                if you have time, including the information below. Refresh the page to try again.
            </p>
            <p className="code">{JSON.stringify(error)}</p>
        </section>
    );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            ErrorBoundary={ErrorComponent}
        >
            <Route
                index
                element={
                    <Navigate
                        replace
                        to="/app/genagram"
                    />
                }
            />
            <Route
                path="app/genagram/:code"
                lazy={() => import('./views/Genagram/Genagram')}
            />
            <Route
                path="app/genagram"
                lazy={() => import('./views/Genagram/Genagram')}
            />
        </Route>
    )
);

function App() {
    return (
        <React.Suspense fallback={<div></div>}>
            <RouterProvider router={router} />
        </React.Suspense>
    );
}

export default App;
