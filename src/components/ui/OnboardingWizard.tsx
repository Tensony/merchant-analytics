import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDashboardStore } from '../../store/useDashboardStore';

interface Step {
  id:       number;
  title:    string;
  subtitle: string;
  icon:     string;
  color:    string;
}

const STEPS: Step[] = [
  {
    id: 1, icon: '▦', color: '#22d98a',
    title: 'Welcome to Merchant Analytics',
    subtitle: 'Your real-time e-commerce intelligence platform. Let\'s get you set up in under 2 minutes.',
  },
  {
    id: 2, icon: '◫', color: '#4d9cf8',
    title: 'Tell us about your store',
    subtitle: 'Help us personalize your dashboard experience.',
  },
  {
    id: 3, icon: '◉', color: '#a78bfa',
    title: 'Choose your focus metrics',
    subtitle: 'Pick the KPIs that matter most to your business.',
  },
  {
    id: 4, icon: '◈', color: '#f5a623',
    title: 'You\'re all set!',
    subtitle: 'Your dashboard is ready. Here\'s what you can do right now.',
  },
];

const STORE_TYPES = [
  { label: 'Fashion & Apparel',   icon: '◈' },
  { label: 'Electronics',         icon: '◉' },
  { label: 'Food & Beverages',    icon: '◐' },
  { label: 'Health & Beauty',     icon: '◑' },
  { label: 'Home & Furniture',    icon: '▦' },
  { label: 'General E-commerce',  icon: '◫' },
];

const METRICS = [
  { key: 'revenue',   label: 'Revenue growth',     icon: '↑', color: '#22d98a' },
  { key: 'churn',     label: 'Reduce churn',        icon: '↓', color: '#ff5757' },
  { key: 'aov',       label: 'Increase order value',icon: '◈', color: '#a78bfa' },
  { key: 'campaigns', label: 'Campaign performance',icon: '◐', color: '#f06291' },
  { key: 'products',  label: 'Product insights',    icon: '◫', color: '#4d9cf8' },
  { key: 'customers', label: 'Customer retention',  icon: '◉', color: '#f5a623' },
];

const QUICK_ACTIONS = [
  { label: 'View your dashboard',  icon: '▦', color: '#22d98a', desc: 'See revenue, orders and KPIs live' },
  { label: 'Add your first product',icon: '◫', color: '#4d9cf8', desc: 'Go to the Products page' },
  { label: 'Set up a campaign',    icon: '◈', color: '#a78bfa', desc: 'Track your first campaign ROI' },
];

export function OnboardingWizard() {
  const { completeOnboarding, user } = useAuthStore();
  const { updateProfile }            = useDashboardStore();
  const [step,          setStep]          = useState(1);
  const [storeName,     setStoreName]     = useState('');
  const [storeType,     setStoreType]     = useState('');
  const [selectedMets,  setSelectedMets]  = useState<string[]>(['revenue']);
  const [animating,     setAnimating]     = useState(false);

  function goNext() {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length));
      setAnimating(false);
    }, 200);
  }

  function handleFinish() {
    if (storeName.trim()) {
      updateProfile({ displayName: user?.name ?? storeName });
    }
    completeOnboarding();
  }

  function toggleMetric(key: string) {
    setSelectedMets((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const currentStep = STEPS[step - 1];
  const progress    = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {/* Progress bar */}
        <div
          className="h-1 transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: currentStep.color,
          }}
        />

        {/* Step indicator */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className="transition-all duration-300"
                style={{
                  width:           step >= s.id ? '24px' : '8px',
                  height:          '8px',
                  borderRadius:    '4px',
                  backgroundColor: step >= s.id ? currentStep.color : 'var(--surface3)',
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>
            Step {step} of {STEPS.length}
          </span>
        </div>

        {/* Content */}
        <div className="p-8">

          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                backgroundColor: currentStep.color + '22',
                color:           currentStep.color,
              }}
            >
              {currentStep.icon}
            </div>
            <div>
              <h2
                className="font-['Syne',sans-serif] text-xl font-bold tracking-tight mb-2"
                style={{ color: 'var(--text)' }}
              >
                {currentStep.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              {[
                { icon: '▦', color: '#22d98a', text: 'Real-time revenue and order tracking' },
                { icon: '◈', color: '#f5a623', text: 'Automatic anomaly detection and alerts' },
                { icon: '◉', color: '#4d9cf8', text: 'Customer retention and cohort analysis' },
                { icon: '◐', color: '#a78bfa', text: 'Campaign ROAS, CTR and CVR tracking' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color + '22', color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text2)' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Step 2 — Store info */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: 'var(--text3)' }}
                >
                  Store name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. My Zambia Store"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border)';  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: 'var(--text3)' }}
                >
                  Store category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STORE_TYPES.map((type) => (
                    <button
                      key={type.label}
                      onClick={() => setStoreType(type.label)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                      style={{
                        backgroundColor: storeType === type.label
                          ? '#22d98a22' : 'var(--surface2)',
                        border: storeType === type.label
                          ? '1px solid #22d98a55' : '1px solid var(--border)',
                        color: storeType === type.label ? '#22d98a' : 'var(--text2)',
                      }}
                    >
                      <span>{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Focus metrics */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-center mb-2" style={{ color: 'var(--text3)' }}>
                Select all that apply
              </p>
              <div className="grid grid-cols-2 gap-2">
                {METRICS.map((m) => {
                  const selected = selectedMets.includes(m.key);
                  return (
                    <button
                      key={m.key}
                      onClick={() => toggleMetric(m.key)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-left transition-all"
                      style={{
                        backgroundColor: selected ? m.color + '22' : 'var(--surface2)',
                        border:          selected ? `1px solid ${m.color}55` : '1px solid var(--border)',
                        color:           selected ? m.color : 'var(--text2)',
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                        style={{
                          backgroundColor: selected ? m.color + '33' : 'var(--surface3)',
                          color:           selected ? m.color : 'var(--text3)',
                        }}
                      >
                        {selected ? '✓' : m.icon}
                      </span>
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="flex flex-col gap-3">
              {QUICK_ACTIONS.map((action) => (
                <div
                  key={action.label}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: action.color + '22', color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {action.label}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                      {action.desc}
                    </p>
                  </div>
                  <span className="ml-auto" style={{ color: 'var(--text3)' }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-8 pb-8"
        >
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-sm px-4 py-2 rounded-xl transition-all"
              style={{ color: 'var(--text3)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-sm transition-colors"
              style={{ color: 'var(--text3)' }}
            >
              Skip for now
            </button>
          )}

          {step < STEPS.length ? (
            <button
              onClick={goNext}
              className="text-sm px-6 py-2.5 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: currentStep.color,
                color:           '#0d0f12',
                boxShadow:       `0 0 20px ${currentStep.color}44`,
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-sm px-6 py-2.5 rounded-xl font-medium transition-all bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
              style={{ boxShadow: '0 0 20px #22d98a44' }}
            >
              Go to dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}