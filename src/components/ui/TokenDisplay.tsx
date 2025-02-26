import React, { useEffect, useState } from 'react';
import { lightTheme as theme } from '../../styles/theme';

export type TokenDisplaySize = 'sm' | 'md' | 'lg' | 'xl';

interface TokenDisplayProps {
  amount: number;
  size?: TokenDisplaySize;
  animated?: boolean;
  showText?: boolean;
  showPlus?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  amount,
  size = 'md',
  animated = false,
  showText = true,
  showPlus = false,
  className,
  style,
}) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (animated) {
      setDisplayAmount(0);
      setIsAnimating(true);
      
      const duration = 1500; // Animation duration in ms
      const steps = 20; // Number of steps for counting animation
      const stepDuration = duration / steps;
      const increment = Math.ceil(amount / steps);
      let currentStep = 0;
      
      const interval = setInterval(() => {
        setDisplayAmount(prev => {
          const next = Math.min(prev + increment, amount);
          if (next >= amount) {
            clearInterval(interval);
            setIsAnimating(false);
          }
          return next;
        });
        
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayAmount(amount);
          setIsAnimating(false);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, animated]);
  
  const getSizeDimensions = (size: TokenDisplaySize) => {
    switch (size) {
      case 'sm':
        return { containerSize: 24, iconSize: 14, textSize: 12 };
      case 'md':
        return { containerSize: 32, iconSize: 18, textSize: 14 };
      case 'lg':
        return { containerSize: 40, iconSize: 24, textSize: 16 };
      case 'xl':
        return { containerSize: 60, iconSize: 36, textSize: 20 };
      default:
        return { containerSize: 32, iconSize: 18, textSize: 14 };
    }
  };
  
  const { containerSize, iconSize, textSize } = getSizeDimensions(size);
  const formattedAmount = showPlus && amount > 0 ? `+${displayAmount}` : `${displayAmount}`;
  
  return (
    <div 
      className={`token-display ${className || ''}`}
      style={style}
    >
      <div
        className={`token-circle ${isAnimating ? 'animating' : ''}`}
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        }}
      >
        <span 
          className="token-icon"
          style={{ fontSize: iconSize }}
        >
          🪙
        </span>
      </div>
      
      {showText && (
        <span 
          className="token-text"
          style={{ fontSize: textSize }}
        >
          {formattedAmount}
        </span>
      )}
      
      <style jsx>{`
        .token-display {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.spacing.xs}px;
        }
        
        .token-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${theme.colors.accent[100]};
          box-shadow: ${theme.spacing.shadow.sm};
          transition: transform 150ms ease;
        }
        
        .token-circle.animating {
          animation: bounce 1s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
        }
        
        .token-icon {
          display: block;
          line-height: 1;
          transform: translateY(1px); // Visual alignment
        }
        
        .token-text {
          font-family: ${theme.typography.fontFamily.body};
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.textPrimary};
          transition: opacity 150ms ease;
        }
        
        @keyframes bounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          75% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        /* Hover effects */
        @media (hover: hover) {
          .token-circle:hover {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default TokenDisplay;