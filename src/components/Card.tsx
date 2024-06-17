import React from 'react';

import '../styles/card.scss';

interface CardProps {
    title: string;
    description?: string; // Optional description
    image?: string; // Optional image URL
}

export const Card = ({
    title, description, image
}: CardProps) => {
    return (
        <div className="storybook-card">
            {image && (
                <img className="img" src={image} alt={title} />
            )}
            <div className="">
                <h3 className="">{title}</h3>
                {description && <p className="">{description}</p>}
            </div>
        </div>
    );
};

