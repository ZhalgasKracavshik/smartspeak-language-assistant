'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/games.css';

const GAMES = [
    {
        id: 'negotiator',
        title: 'The Negotiator',
        description: 'Step into the Grand Bazaar and test your bargaining skills against Ahmed, the toughest carpet seller in Istanbul. Can you get the best price?',
        image: 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        link: '/negotiator', // Linking to the existing negotiator page
        badge: 'Roleplay',
        badgeClass: 'badge-negotiator'
    },
    {
        id: 'debater',
        title: 'The Debater',
        description: 'Challenge the AI in a fierce debate on random controversial topics. Sharpen your argumentation, logic, and persuasion skills.',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        link: '/games/debater',
        badge: 'Logic',
        badgeClass: 'badge-debater'
    }
];

export default function GamesPage() {
    return (
        <div className="games-page">
            <div className="games-header">
                <h1>🎮 Mini-Games Arena</h1>
                <p>Gamify your learning experience with immersive challenges</p>
            </div>

            <div className="games-grid">
                {GAMES.map((game) => (
                    <Link href={game.link} key={game.id} className="game-card">
                        <div
                            className="game-card__image"
                            style={{ backgroundImage: `url(${game.image})` }}
                        >
                            <div className={`game-card__badge ${game.badgeClass}`}>
                                {game.badge}
                            </div>
                        </div>
                        <div className="game-card__content">
                            <h3 className="game-card__title">{game.title}</h3>
                            <p className="game-card__description">{game.description}</p>
                            <div className="play-btn">Play Now →</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
