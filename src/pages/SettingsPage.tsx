import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { FormField, Input, Select } from '../components/ui/FormField';
import { useDashboardStore } from '../store/useDashboardStore';
import { useAuthStore } from '../store/useAuthStore';
import { triggerAnomalyToast } from '../components/ui/AnomalyToast';

const TIMEZONE_OPTIONS = [
  { label: 'Africa/Lusaka (CAT)',   value: 'Africa/Lusaka (CAT)'   },
  { label: 'UTC',                   value: 'UTC'                   },
  { label: 'America/New_York (EST)',value: 'America/New_York (EST)'},
  { label: 'Europe/London (GMT)',   value: 'Europe/London (GMT)'   },
  { label: 'Asia/Tokyo (JST)',      value: 'Asia/Tokyo (JST)'      },
];

const CURRENCY_OPTIONS = [
  { label: 'USD ($)', value: 'USD ($)' },
  { label: 'EUR (€)', value: 'EUR (€)' },
  { label: 'GBP (£)', value: 'GBP (£)' },
  { label: 'ZMW (K)', value: 'ZMW (K)' },
];

const NOTIFICATION_ITEMS = [
  {
    key:   'anomalyAlerts' as const,
    label: 'Anomaly alerts',
    desc:  'Get notified when metrics spike or drop unusually',
  },
  {
    key:   'weeklyDigest' as const,
    label: 'Weekly digest',
    desc:  'Summary of key metrics every Monday morning',
  },
  {
    key:   'newOrderAlerts' as const,
    label: 'New order alerts',
    desc:  'Notify on each new order above $500',
  },
  {
    key:   'campaignPerformance' as const,
    label: 'Campaign performance',
    desc:  'Daily campaign spend and ROAS summary',
  },
];

export function SettingsPage() {
  const { profile, notifications, updateProfile, updateNotifications } =
    useDashboardStore();
  const { user } = useAuthStore();

  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [isDirty,      setIsDirty]      = useState(false);

  function handleProfileChange(field: keyof typeof profile, value: string) {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  function handleSave() {
    updateProfile(localProfile);
    setIsDirty(false);
    triggerAnomalyToast('✓ Settings saved successfully');
  }

  function handleNotificationToggle(key: keyof typeof notifications) {
    updateNotifications({ [key]: !notifications[key] });
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">

      {/* Header */}
      <div>
        <h1
          className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Settings
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
          Manage your workspace preferences
        </p>
      </div>

      {/* Profile */}
      <Panel>
        <PanelHeader title="Profile" />
        <div className="p-[18px] flex flex-col gap-4">

          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-lg font-medium flex-shrink-0">
              {localProfile.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text)' }}
              >
                {localProfile.displayName}
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: 'var(--text3)' }}
              >
                Admin · merchant.analytics
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Display name">
              <Input
                type="text"
                value={localProfile.displayName}
                onChange={(e) => handleProfileChange('displayName', e.target.value)}
              />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                value={localProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </FormField>

            <FormField label="Timezone">
              <Select
                value={localProfile.timezone}
                onChange={(e) => handleProfileChange('timezone', e.target.value)}
                options={TIMEZONE_OPTIONS}
              />
            </FormField>

            <FormField label="Currency">
              <Select
                value={localProfile.currency}
                onChange={(e) => handleProfileChange('currency', e.target.value)}
                options={CURRENCY_OPTIONS}
              />
            </FormField>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="text-xs px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
              style={{
                backgroundColor: isDirty ? '#22d98a' : 'var(--surface3)',
                color:           isDirty ? '#0d0f12' : 'var(--text3)',
                cursor:          isDirty ? 'pointer' : 'not-allowed',
              }}
            >
              {isDirty ? 'Save changes' : 'No changes'}
            </button>
          </div>
        </div>
      </Panel>

      {/* Plan */}
      <Panel>
        <PanelHeader title="Your plan" />
        <div className="p-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-sm font-medium capitalize"
              style={{ color: 'var(--text)' }}
            >
              {user?.plan ?? 'Starter'} plan
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
              {user?.plan === 'starter'
                ? 'Upgrade to unlock more stores, longer history and alerts'
                : user?.plan === 'growth'
                ? 'Upgrade to Pro for unlimited stores and API access'
                : 'You are on the highest plan'}
            </p>
          </div>
          {user?.plan !== 'pro' && (
            <Link
              to="/pricing"
              className="text-xs px-4 py-2 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] text-center w-full sm:w-auto"
            >
              Upgrade plan
            </Link>
          )}
        </div>
      </Panel>

      {/* Notifications */}
      <Panel>
        <PanelHeader title="Notifications" />
        <div className="p-[18px] flex flex-col gap-0">
          {NOTIFICATION_ITEMS.map((item, i) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
              style={{
                borderBottom:
                  i < NOTIFICATION_ITEMS.length - 1
                    ? '1px solid var(--border)'
                    : 'none',
              }}
            >
              <div className="flex-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: 'var(--text3)' }}
                >
                  {item.desc}
                </p>
              </div>

              {/* Toggle switch */}
              <div
                onClick={() => handleNotificationToggle(item.key)}
                className="flex items-center cursor-pointer flex-shrink-0 rounded-full transition-colors duration-200 self-end sm:self-center"
                style={{
                  width:           '36px',
                  height:          '20px',
                  padding:         '2px',
                  backgroundColor: notifications[item.key] ? '#22d98a' : 'var(--surface3)',
                  border:          '1px solid var(--border)',
                }}
              >
                <div
                  className="rounded-full transition-transform duration-200"
                  style={{
                    width:      '14px',
                    height:     '14px',
                    background: 'white',
                    transform:  notifications[item.key]
                      ? 'translateX(16px)'
                      : 'translateX(0)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Danger zone */}
      <Panel>
        <PanelHeader title="Danger zone" />
        <div className="p-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: 'var(--text)' }}
            >
              Reset all preferences
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: 'var(--text3)' }}
            >
              Clears theme, time range, and metric preferences from local storage
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('merchant-dashboard');
              window.location.reload();
            }}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-all w-full sm:w-auto"
            style={{
              border: '1px solid var(--border)',
              color: '#ff5757',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3d0d0d';
              e.currentTarget.style.borderColor = '#ff5757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            Reset preferences
          </button>
        </div>
      </Panel>

    </div>
  );
}