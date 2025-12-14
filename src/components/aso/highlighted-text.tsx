import * as React from 'react';
import type { WordAnalysis } from '@/types/aso';

interface HighlightedTextProps {
  text: string;
  words: WordAnalysis[];
}

export function HighlightedText({ text, words }: HighlightedTextProps) {
  if (words.length === 0) {
    return <span>{text}</span>;
  }

  const parts: React.ReactElement[] = [];
  let lastIndex = 0;

  words.forEach((word, index) => {
    // Add text before this word
    if (word.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${index}`}>{text.substring(lastIndex, word.startIndex)}</span>,
      );
    }

    // Add the highlighted word
    let bgColor = '';
    if (word.type === 'stop') {
      bgColor = 'bg-gray-200';
    } else if (word.type === 'wasted') {
      bgColor = 'bg-gray-400';
    } else if (word.type === 'whitespace') {
      bgColor = 'bg-red-200';
    } else if (word.type === 'duplicate') {
      bgColor = 'bg-purple-200';
    } else if (word.type === 'multiword') {
      bgColor = 'bg-red-800 text-white';
    } else if (word.type === 'plural') {
      bgColor = 'bg-blue-200';
    }
    parts.push(
      <span key={`word-${index}`} className={bgColor}>
        {word.word}
      </span>,
    );

    lastIndex = word.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <span>{parts}</span>;
}
