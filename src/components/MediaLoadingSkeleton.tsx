'use client';

import React from 'react';
import '../components/Improvements.css';

export function MediaLoadingSkeleton() {
    return (
        <div className="content-hub__skeleton-grid">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="skeleton-card">
                    <div className="skeleton-card__thumbnail skeleton" />
                    <div className="skeleton-card__content">
                        <div className="skeleton-card__title skeleton" />
                        <div className="skeleton-card__description skeleton" />
                        <div className="skeleton-card__description skeleton" />
                        <div className="skeleton-card__metadata">
                            <div className="skeleton-card__badge skeleton" />
                            <div className="skeleton-card__badge skeleton" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
