import './Badge.css';

interface BadgeProps {
  text: string;
  kind: 'severity' | 'priority' | 'status';
}

function toModifier(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export function Badge({ text, kind }: BadgeProps) {
  return (
    <span className={`badge badge--${kind}-${toModifier(text)}`} data-testid={`badge-${kind}`}>
      {text}
    </span>
  );
}
