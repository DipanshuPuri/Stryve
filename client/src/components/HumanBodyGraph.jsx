import { useNavigate } from 'react-router-dom';

const getMuscleColor = (score) => {
  if (score <= 30) return '#ef4444';
  if (score <= 50) return '#f97316';
  if (score <= 70) return '#eab308';
  if (score <= 85) return '#22c55e';
  return '#3b82f6';
};

const leftLabels = [
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'biceps', name: 'Biceps' },
  { id: 'abs', name: 'Abs' },
  { id: 'legs', name: 'Quads' },
];

const rightLabels = [
  { id: 'chest', name: 'Chest' },
  { id: 'triceps', name: 'Triceps' },
  { id: 'back', name: 'Obliques' },
  { id: 'legs', name: 'Calves' },
];

function Label({ name, score, side, onClick }) {
  const color = getMuscleColor(score);
  const isLeft = side === 'left';

  return (
    <div
      className="flex items-center gap-3 cursor-pointer group transition-transform duration-200 hover:scale-105"
      style={{ flexDirection: isLeft ? 'row' : 'row-reverse' }}
      onClick={onClick}
    >
      {/* The label text */}
      <div style={{ textAlign: isLeft ? 'right' : 'left' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-300 transition-colors leading-none mb-1">
          {name}
        </p>
        <p className="text-2xl font-black leading-none" style={{ color }}>
          {score}
        </p>
      </div>
      {/* Connector line */}
      <div className="flex items-center" style={{ width: '28px' }}>
        <div style={{ width: '100%', height: '1px', backgroundColor: color, opacity: 0.35 }} />
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color, opacity: 0.5, flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default function HumanBodyGraph({ scores }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-[520px] mx-auto">
      {/* Left labels column */}
      <div className="flex flex-col justify-between py-6" style={{ height: '420px', minWidth: '110px' }}>
        {leftLabels.map((label) => (
          <Label
            key={label.name}
            name={label.name}
            score={scores[label.id] || 0}
            side="left"
            onClick={() => navigate(`/workouts?target=${label.id}`)}
          />
        ))}
      </div>

      {/* Center body image */}
      <div className="flex-shrink-0" style={{ width: '260px' }}>
        <img
          src="/images/body-anatomy.png"
          alt="Human Body Anatomy"
          className="w-full h-auto select-none pointer-events-none"
          draggable="false"
          style={{ filter: 'invert(1) brightness(1) contrast(1.2)', mixBlendMode: 'screen' }}
        />
      </div>

      {/* Right labels column */}
      <div className="flex flex-col justify-between py-6" style={{ height: '420px', minWidth: '110px' }}>
        {rightLabels.map((label) => (
          <Label
            key={label.name}
            name={label.name}
            score={scores[label.id] || 0}
            side="right"
            onClick={() => navigate(`/workouts?target=${label.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
