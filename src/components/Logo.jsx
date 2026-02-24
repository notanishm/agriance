import React from 'react';

const Logo = ({ size = 28, color = 'currentColor', className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer Shield/Seal Shape - Minimalist Hexagon with subtle curve */}
            <path
                d="M50 5L10 25V55C10 75 30 90 50 95C70 90 90 75 90 55V25L50 5Z"
                stroke={color}
                strokeWidth="4"
                strokeLinejoin="round"
            />

            {/* Internal Symmetrical Sprout/Wheat Hybrid */}
            {/* Center Stem */}
            <path
                d="M50 80V35"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Left Leaf - Stylized Geometric */}
            <path
                d="M50 65C50 65 30 60 25 45C22 35 35 30 45 35"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Right Leaf - Stylized Geometric */}
            <path
                d="M50 65C50 65 70 60 75 45C78 35 65 30 55 35"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Top Seed/Finial - Financial Precision */}
            <circle cx="50" cy="25" r="4" fill={color} />
        </svg>
    );
};

export default Logo;
