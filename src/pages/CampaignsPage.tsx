import { Panel, PanelHeader } from '../components/ui/Panel';
import { CAMPAIGNS } from '../data/mockData';
import { clsx } from 'clsx';
import type { Campaign } from '../types';

const CHANNEL_CONFIG: Record<Campaign['channel'], { label: string; color: string }> = {
  email:  { label: 'Email',  color: '#a78bfa' },
  paid:   { label: 'Paid',   color: '#4d9cf8' },
  social: { label: 'Social', color: '#f06291' },
  sms:    { label: 'SMS',    color: '#f5a623' },
};

const STATUS_CONFIG: Record<Campaign['status'], { label: string; className: string }> = {
  active:    { label: 'Active',    className: 'bg-emerald-950 text-emerald-400' },
  paused:    { label: 'Paused',    className: 'bg-amber-950 text-amber-400'     },
  completed: { label: 'Completed', className: 'bg-[#252a35] text-[#8b90a0]'    },
};

function roas(campaign: Campaign): string {
  if (campaign.spent === 0) return '—';
  return (campaign.revenue / campaign.spent).toFixed(2) + 'x';
}

function ctr(campaign: Campaign): string {
  if (campaign.impressions === 0) return '—';
  return ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + '%';
}

function cvr(campaign: Campaign): string {
  if (campaign.clicks === 0) return '—';
  return ((campaign.conversions / campaign.clicks) * 100).toFixed(2) + '%';
}

function budgetPct(campaign: Campaign): number {
  return campaign.budget > 0
    ? Math.min(Math.round((campaign.spent / campaign.budget) * 100), 100)
    : 0;
}

export function CampaignsPage() {
  const totalRevenue     = CAMPAIGNS.reduce((a, c) => a + c.revenue, 0);
  const totalSpend       = CAMPAIGNS.reduce((a, c) => a + c.spent, 0);
  const totalConversions = CAMPAIGNS.reduce((a, c) => a + c.conversions, 0);
  const overallROAS      = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '—';

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Syne',sans-serif] text-xl font-bold text-[#e8eaf0] tracking-tight">
            Campaigns
          </h1>
          <p className="text-xs text-[#555c70] mt-0.5">
            {CAMPAIGNS.length} campaigns · ${totalSpend.toLocaleString()} total spend
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] font-medium text-xs px-4 py-2 rounded-lg transition-colors">
          + New campaign
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',   value: '$' + totalRevenue.toLocaleString(),     color: '#22d98a' },
          { label: 'Total Spend',     value: '$' + totalSpend.toLocaleString(),       color: '#ff5757' },
          { label: 'Conversions',     value: totalConversions.toLocaleString(),       color: '#4d9cf8' },
          { label: 'Overall ROAS',    value: overallROAS + 'x',                       color: '#a78bfa' },
        ].map((card) => (
          <div key={card.label} className="bg-[#161920] border border-[#2a2f3d] rounded-xl p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] mb-2">
              {card.label}
            </p>
            <p
              className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="flex flex-col gap-3">
        {CAMPAIGNS.map((camp) => {
          const ch     = CHANNEL_CONFIG[camp.channel];
          const st     = STATUS_CONFIG[camp.status];
          const pct    = budgetPct(camp);

          return (
            <Panel key={camp.id}>
              <div className="p-[18px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded font-medium"
                      style={{ background: ch.color + '22', color: ch.color }}
                    >
                      {ch.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#e8eaf0]">{camp.name}</p>
                      <p className="text-[10px] font-mono text-[#555c70] mt-0.5">
                        {camp.startDate} → {camp.endDate}
                      </p>
                    </div>
                  </div>
                  <span className={clsx('font-mono text-[10px] px-2 py-0.5 rounded', st.className)}>
                    {st.label}
                  </span>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {[
                    { label: 'Impressions',  value: (camp.impressions / 1000).toFixed(0) + 'k' },
                    { label: 'Clicks',       value: camp.clicks.toLocaleString()               },
                    { label: 'CTR',          value: ctr(camp)                                  },
                    { label: 'Conversions',  value: camp.conversions.toLocaleString()           },
                    { label: 'CVR',          value: cvr(camp)                                  },
                    { label: 'ROAS',         value: roas(camp)                                 },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className="font-mono text-[9px] tracking-widest uppercase text-[#555c70] mb-1">
                        {m.label}
                      </p>
                      <p className="font-mono text-sm text-[#e8eaf0] font-medium">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Budget bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-[#555c70]">Budget used</span>
                    <span className="font-mono text-[10px] text-[#8b90a0]">
                      ${camp.spent.toLocaleString()} / ${camp.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#252a35] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 90 ? '#ff5757' : pct >= 70 ? '#f5a623' : '#22d98a',
                      }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-[#555c70] mt-1">{pct}% used</p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}