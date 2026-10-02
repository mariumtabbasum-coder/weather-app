import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Found',
  message = "We couldn't find any city with that name. Try searching again.",
  onReset,
}) => {
  return (
    <div className="state-container glass-card">
      <div className="state-icon-box empty">
        <SearchX size={36} />
      </div>
      <h2 className="state-title">{title}</h2>
      <p className="state-desc">{message}</p>
      <button type="button" className="btn-secondary" onClick={onReset}>
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>
    </div>
  );
};
