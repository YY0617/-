import React, { useState, useRef, useCallback } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

export const VirtualJoystick: React.FC<JoystickProps> = ({ onMove, onEnd }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setActive(true);
  }, []);

  const handleMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!active || !containerRef.current || !joystickRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;

    const maxDistance = rect.width / 2 - 20;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance;
      deltaY = (deltaY / distance) * maxDistance;
    }

    setPosition({ x: deltaX, y: deltaY });

    // 归一化到 -1 到 1 的范围
    const normalizedX = deltaX / maxDistance;
    const normalizedY = deltaY / maxDistance;
    onMove(normalizedX, normalizedY);
  }, [active, onMove]);

  const handleEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onEnd();
  }, [onEnd]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-black bg-opacity-20 border-4 border-white border-opacity-30"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        ref={joystickRef}
        className="absolute w-16 h-16 rounded-full bg-white bg-opacity-80 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
