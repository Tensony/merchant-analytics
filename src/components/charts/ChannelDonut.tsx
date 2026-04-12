import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChannelData } from '../../types';

interface ChannelDonutProps {
  data: ChannelData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-[#161920] border border-[#363d50] rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-[#e8eaf0] font-medium">{entry.name}</p>
      <p className="font-mono text-[11px]" style={{ color: entry.payload.color }}>
        {entry.value}%
      </p>
    </div>
  );
}

export function ChannelDonut({ data }: ChannelDonutProps) {
  return (
    <div className="flex items-center gap-4 px-[18px] py-4">
      <div className="h-[160px] w-[160px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[11px] text-[#8b90a0]">{entry.name}</span>
            <span className="font-mono text-[11px] text-[#555c70] ml-auto pl-3">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}