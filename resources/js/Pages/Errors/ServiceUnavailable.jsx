import React from 'react';
import ErrorPage from './ErrorPage';

export default function ServiceUnavailable() {
    return (
        <ErrorPage status={503} showRetry={false} />
    )
}
