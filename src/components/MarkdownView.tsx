import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Simple clean markdown parser for headings, lists, bold, italics, code
  const renderLines = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const flushList = (keyPrefix: string) => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`${keyPrefix}-ul`} className="list-disc list-inside space-y-1 my-2 text-slate-300">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushCodeBlock = (keyPrefix: string) => {
      if (inCodeBlock) {
        elements.push(
          <pre key={`${keyPrefix}-code`} className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto my-3">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(`cb-${idx}`);
        } else {
          flushList(`pre-cb-${idx}`);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList(`h3-${idx}`);
        elements.push(
          <h3 key={`h3-${idx}`} className="text-base font-semibold text-cyan-400 mt-4 mb-2">
            {formatInlineText(trimmed.replace('### ', ''))}
          </h3>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList(`h2-${idx}`);
        elements.push(
          <h2 key={`h2-${idx}`} className="text-lg font-bold text-white border-b border-slate-800 pb-1 mt-5 mb-3">
            {formatInlineText(trimmed.replace('## ', ''))}
          </h2>
        );
      } else if (trimmed.startsWith('# ')) {
        flushList(`h1-${idx}`);
        elements.push(
          <h1 key={`h1-${idx}`} className="text-xl font-bold text-white mt-4 mb-3">
            {formatInlineText(trimmed.replace('# ', ''))}
          </h1>
        );
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        inList = true;
        const itemText = trimmed.replace(/^[\*\-]\s+/, '');
        listItems.push(
          <li key={`li-${idx}`} className="text-slate-300 leading-relaxed text-sm">
            {formatInlineText(itemText)}
          </li>
        );
      } else if (/^\d+\.\s+/.test(trimmed)) {
        inList = true;
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        listItems.push(
          <li key={`oli-${idx}`} className="text-slate-300 leading-relaxed text-sm">
            {formatInlineText(itemText)}
          </li>
        );
      } else if (trimmed === '') {
        flushList(`space-${idx}`);
        elements.push(<div key={`empty-${idx}`} className="h-2" />);
      } else {
        flushList(`p-${idx}`);
        elements.push(
          <p key={`p-${idx}`} className="text-slate-300 leading-relaxed text-sm my-1.5">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    flushList('final');
    flushCodeBlock('final');

    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    // Process bold (**text**), italics (*text*), inline code (`code`)
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(<strong key={match.index} className="font-semibold text-slate-100">{match[2]}</strong>);
      } else if (match[3]) {
        // Italic
        parts.push(<em key={match.index} className="italic text-slate-300">{match[3]}</em>);
      } else if (match[4]) {
        // Code
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-xs border border-slate-800">
            {match[4]}
          </code>
        );
      }

      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return <div className={`markdown-body space-y-1 ${className}`}>{renderLines()}</div>;
};
