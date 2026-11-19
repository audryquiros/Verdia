import { useEffect, useId, useRef, useState } from 'react';
import vine from '../../assets/landing/botanical/enredadera-recorrido.svg';
import './AnimatedVine.css';

const GROWTH_PATH = `M 345 75
  C 350 105 347 128 352 154
  C 357 183 375 205 398 223
  C 424 243 450 255 470 279
  C 490 304 493 332 505 360
  C 518 389 497 413 516 435
  C 539 460 566 468 574 500
  C 585 535 573 568 582 601
  C 591 635 610 657 606 691
  C 601 725 577 749 585 782
  C 593 812 608 835 616 862
  C 622 883 621 905 634 929`;

export default function AnimatedVine({ className = '' }) {
  const clipId = useId().replace(/:/g, '');
  const pathRef = useRef(null);
  const [length, setLength] = useState(1);

  useEffect(() => {
    if (!pathRef.current) return;
    try {
      setLength(pathRef.current.getTotalLength());
    } catch {
      setLength(1);
    }
  }, []);

  return (
    <svg className={`animated-vine ${className}`} viewBox="0 0 831 1122" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path
            ref={pathRef}
            d={GROWTH_PATH}
            fill="none"
            stroke="white"
            strokeWidth="190"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: length,
              strokeDashoffset: length,
              animation: `vineReveal 4.6s cubic-bezier(.22,.61,.36,1) forwards`,
            }}
          />
        </clipPath>
      </defs>
      <image
        href={vine}
        x="0"
        y="0"
        width="831"
        height="1122"
        preserveAspectRatio="xMidYMid meet"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}
