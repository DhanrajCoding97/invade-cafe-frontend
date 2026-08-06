import NumberFlow, { NumberFlowGroup } from '@number-flow/react';

export default function CountdownTicker({
  seconds,
  danger,
}: {
  seconds: number;
  danger: boolean;
}) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const showHours = h > 0;

  return (
    <div
      className={`inline-flex items-center gap-1 text-sm font-mono tabular-nums ${
        danger ? 'text-red-400' : 'text-cyan-300'
      }`}
    >
      <NumberFlowGroup>
        {showHours && (
          <>
            <NumberFlow value={h} format={{ minimumIntegerDigits: 2 }} />
            <span>:</span>
          </>
        )}
        <NumberFlow value={m} format={{ minimumIntegerDigits: 2 }} />
        <span>:</span>
        <NumberFlow value={s} format={{ minimumIntegerDigits: 2 }} />
      </NumberFlowGroup>
    </div>
  );
}
