import clsx from 'clsx';

interface GameDisplayProps {
   title: string;
   columns: { sm: number; md: number; lg: number };
   className?: string;
   children: React.ReactElement[];
}

export default function GridDisplay({
   title,
   // columns, // issue with this
   className: classNameProp,
   children,
}: GameDisplayProps) {
   // const gridSizing = `grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;

   return (
      <div
         className={[
            'grow flex flex-col gap-2  p-2 min-h-0',
            classNameProp,
         ].join(' ')}
      >
         <h1 className="text-xl">{title}</h1>
         <div className="grow w-full overflow-y-auto rounded-xl">
            <div
               className={clsx(
                  'w-full h-full grid gap-2 flex-wrap',
                  // gridSizing
                  'grid-cols-3 lg:grid-cols-4'
               )}
            >
               {children}
            </div>
         </div>
      </div>
   );
}
