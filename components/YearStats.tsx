'use client';

import Link from 'next/link';

type YearItem = { year: string; count: number };

function filmPlural(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count.toLocaleString('sr-RS')} filmova`;
  }
  
  if (lastDigit === 1) {
    return `${count.toLocaleString('sr-RS')} film`;
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count.toLocaleString('sr-RS')} filma`;
  }
  
  return `${count.toLocaleString('sr-RS')} filmova`;
}

export default function YearStats({ topYears }: { topYears: YearItem[] }) {
  return (
    <ol className="space-y-1.5 list-decimal list-inside text-neutral-300">
      {topYears.map((y,i)=> (
        <li key={i} className="flex items-center justify-between">
          <span className="truncate pr-2 text-neutral-300 text-sm">{y.year}</span>
          <Link href={`/browse?year=${y.year}`} className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors">
            {filmPlural(y.count)}
          </Link>
        </li>
      ))}
    </ol>
  );
}
