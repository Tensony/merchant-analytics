import { useState } from 'react';
import { Panel } from '../components/ui/Panel';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';
import { useDashboardStore } from '../store/useDashboardStore';
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

const CHANNEL_OPTIONS = [
  { label: 'Email',  value: 'email'  },
  { label: 'Paid',   value: 'paid'   },
  { label: 'Social', value: 'social' },
  { label: 'SMS',    value: 'sms'    },
];

const STATUS_OPTIONS = [
  { label: 'Active',    value: 'active'    },
  { label: 'Paused',    value: 'paused'    },
  { label: 'Completed', value: 'completed' },
];

interface CampaignForm {
  name:       string;
  channel:    Campaign['channel'];
  status:     Campaign['status'];
  budget:     string;
  startDate:  string;
  endDate:    string;
}

const EMPTY_FORM: CampaignForm = {
  name:      '',
  channel:   'email',
  status:    'active',
  budget:    '',
  startDate: '',
  endDate:   '',
};

function roas(c: Campaign)   { return c.spent > 0 ? (c.revenue / c.spent).toFixed(2) + 'x' : '—'; }
function ctr(c: Campaign)    { return c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) + '%' : '—'; }
function cvr(c: Campaign)    { return c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(2) + '%' : '—'; }
function budgetPct(c: Campaign) { return c.budget > 0 ? Math.min(Math.round((c.spent / c.budget) * 100), 100) : 0; }

export function CampaignsPage() {
  const { campaigns, addCampaign } = useDashboardStore();

  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState<CampaignForm>(EMPTY_FORM);
  const [errors,    setErrors]    = useState<Partial<CampaignForm>>({});

  const totalRevenue     = campaigns.reduce((a, c) => a + c.revenue, 0);
  const totalSpend       = campaigns.reduce((a, c) => a + c.spent, 0);
  const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);
  const overallROAS      = totalSpend > 0
    ? (totalRevenue / totalSpend).toFixed(2) + 'x'
    : '—';

  function validate(): boolean {
    const e: Partial<CampaignForm> = {};
    if (!form.name.trim())                           e.name      = 'Name is required';
    if (!form.budget || isNaN(Number(form.budget)))  e.budget    = 'Valid budget required';
    if (!form.startDate)                             e.startDate = 'Start date required';
    if (!form.endDate)                               e.endDate   = 'End date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const newCampaign: Campaign = {
      id:          Date.now().toString(),
      name:        form.name.trim(),
      channel:     form.channel,
      status:      form.status,
      budget:      Number(form.budget),
      spent:       0,
      impressions: 0,
      clicks:      0,
      conversions: 0,
      revenue:     0,
      startDate:   form.startDate,
      endDate:     form.endDate,
    };

    addCampaign(newCampaign);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(false);
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Campaigns
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
            {campaigns.length} campaigns · ${totalSpend.toLocaleString()} total spend
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 font-medium text-xs px-4 py-2 rounded-lg transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
        >
          + New campaign
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  value: '$' + totalRevenue.toLocaleString(), color: '#22d98a' },
          { label: 'Total Spend',    value: '$' + totalSpend.toLocaleString(),   color: '#ff5757' },
          { label: 'Conversions',    value: totalConversions.toLocaleString(),   color: '#4d9cf8' },
          { label: 'Overall ROAS',   value: overallROAS,                         color: '#a78bfa' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2"
              style={{ color: 'var(--text3)' }}
            >
              {card.label}
            </p>
            <p
              className="font-['Syne',sans-serif] text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="flex flex-col gap-3">
        {campaigns.map((camp) => {
          const ch  = CHANNEL_CONFIG[camp.channel];
          const st  = STATUS_CONFIG[camp.status];
          const pct = budgetPct(camp);

          return (
            <Panel key={camp.id}>
              <div className="p-[18px]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded font-medium w-fit"
                      style={{
                        background: ch.color + '22',
                        color: ch.color,
                      }}
                    >
                      {ch.label}
                    </span>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--text)' }}
                      >
                        {camp.name}
                      </p>
                      <p
                        className="text-[10px] font-mono mt-0.5"
                        style={{ color: 'var(--text3)' }}
                      >
                        {camp.startDate} → {camp.endDate}
                      </p>
                    </div>
                  </div>
                  <span className={clsx('font-mono text-[10px] px-2 py-0.5 rounded w-fit', st.className)}>
                    {st.label}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-4">
                  {[
                    { label: 'Impressions', value: camp.impressions > 0 ? (camp.impressions / 1000).toFixed(0) + 'k' : '—' },
                    { label: 'Clicks',      value: camp.clicks > 0 ? camp.clicks.toLocaleString() : '—'                    },
                    { label: 'CTR',         value: ctr(camp)                                                                },
                    { label: 'Conversions', value: camp.conversions > 0 ? camp.conversions.toLocaleString() : '—'           },
                    { label: 'CVR',         value: cvr(camp)                                                                },
                    { label: 'ROAS',        value: roas(camp)                                                               },
                  ].map((m) => (
                    <div key={m.label}>
                      <p
                        className="font-mono text-[9px] tracking-widest uppercase mb-1"
                        style={{ color: 'var(--text3)' }}
                      >
                        {m.label}
                      </p>
                      <p
                        className="font-mono text-xs md:text-sm font-medium"
                        style={{ color: 'var(--text)' }}
                      >
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Budget bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: 'var(--text3)' }}
                    >
                      Budget used
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: 'var(--text2)' }}
                    >
                      ${camp.spent.toLocaleString()} / ${camp.budget.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--surface3)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 90 ? '#ff5757' :
                          pct >= 70 ? '#f5a623' :
                          '#22d98a',
                      }}
                    />
                  </div>
                  <p
                    className="font-mono text-[10px] mt-1"
                    style={{ color: 'var(--text3)' }}
                  >
                    {pct}% used
                  </p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Add Campaign Modal */}
      {showModal && (
        <Modal title="New campaign" onClose={handleClose}>
          <div className="flex flex-col gap-3">
            <FormField label="Campaign name" required error={errors.name}>
              <Input
                type="text"
                placeholder="e.g. Spring Sale Email"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Channel" required>
                <Select
                  value={form.channel}
                  onChange={(e) =>
                    setForm({ ...form, channel: e.target.value as Campaign['channel'] })
                  }
                  options={CHANNEL_OPTIONS}
                />
              </FormField>

              <FormField label="Status" required>
                <Select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Campaign['status'] })
                  }
                  options={STATUS_OPTIONS}
                />
              </FormField>
            </div>

            <FormField label="Budget ($)" required error={errors.budget}>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Start date" required error={errors.startDate}>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </FormField>

              <FormField label="End date" required error={errors.endDate}>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
            <button
              onClick={handleClose}
              className="text-xs px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-xs px-4 py-2 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] w-full sm:w-auto"
            >
              Create campaign
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}