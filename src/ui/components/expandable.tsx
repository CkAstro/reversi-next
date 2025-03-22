'use client';

import { useEffect, useRef, useState } from 'react';

interface ExpandableProps {
   header: React.ReactNode;
   body: React.ReactNode;
   animationMs?: number;
   className?: string;
}

const getBodyElement = (
   container: HTMLDivElement | null
): HTMLElement | null => {
   if (container === null) return null;
   const element = container.lastChild;
   if (element === null || !(element instanceof HTMLElement)) return null;
   return element;
};

export const Expandable: React.FC<ExpandableProps> = ({
   header,
   body,
   animationMs = 300,
   className: classNameProp,
}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [maxHeight, setMaxHeight] = useState(0);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   const handleClick = () => {
      const bodyElement = getBodyElement(containerRef.current);
      if (bodyElement === null) return;

      bodyElement.style.display = 'block';
      setMaxHeight(isExpanded ? 0 : bodyElement.scrollHeight);
      setIsExpanded(!isExpanded);
   };

   useEffect(() => {
      if (isExpanded) return;

      timeoutRef.current = setTimeout(() => {
         const bodyElement = getBodyElement(containerRef.current);
         if (bodyElement === null) return;

         bodyElement.style.display = 'none';
      }, animationMs);

      return () => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, [isExpanded, animationMs]);

   return (
      <div ref={containerRef} className={classNameProp} onClick={handleClick}>
         {header}
         <div
            style={{ maxHeight: `${maxHeight}px` }}
            className="transition-height duration-300 ease overflow-hidden"
         >
            {body}
         </div>
      </div>
   );
};
