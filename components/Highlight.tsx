import React from 'react';

interface HighlightProps {
  text: string;
  highlight?: string;
}

export const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }

  // Create a regex that finds all occurrences of any word in the highlight string
  const searchWords = highlight.trim().split(' ').filter(word => word.length > 0);
  const regex = new RegExp(`(${searchWords.join('|')})`, 'gi');
  
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 text-black rounded px-1 py-0.5 m-[-1px]">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};