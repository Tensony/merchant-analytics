import { Panel, PanelHeader } from '../components/ui/Panel';

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="font-['Syne',sans-serif] text-xl font-bold text-[#e8eaf0] tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-[#555c70] mt-0.5">Manage your workspace preferences</p>
      </div>

      <Panel>
        <PanelHeader title="Profile" />
        <div className="p-[18px] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-lg font-medium">
              TM
            </div>
            <div>
              <p className="text-sm text-[#e8eaf0] font-medium">Tenson M.</p>
              <p className="text-xs text-[#555c70] font-mono">Admin · merchant.analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Display name', value: 'Tenson M.'              },
              { label: 'Email',        value: 'tenson@merchant.io'     },
              { label: 'Timezone',     value: 'Africa/Lusaka (CAT)'    },
              { label: 'Currency',     value: 'USD ($)'                },
            ].map((field) => (
              <div key={field.label}>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] mb-1.5">
                  {field.label}
                </p>
                <input
                  defaultValue={field.value}
                  className="w-full bg-[#1e222b] border border-[#2a2f3d] rounded-lg px-3 py-2 text-xs text-[#e8eaf0] outline-none focus:border-[#363d50] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] font-medium text-xs px-4 py-2 rounded-lg transition-colors">
              Save changes
            </button>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Notifications" />
        <div className="p-[18px] flex flex-col gap-3">
          {[
            { label: 'Anomaly alerts',        desc: 'Get notified when metrics spike or drop unusually', on: true  },
            { label: 'Weekly digest',         desc: 'Summary of key metrics every Monday morning',       on: true  },
            { label: 'New order alerts',      desc: 'Notify on each new order above $500',               on: false },
            { label: 'Campaign performance',  desc: 'Daily campaign spend and ROAS summary',             on: true  },
          ].map((setting) => (
            <div
              key={setting.label}
              className="flex items-center justify-between py-2 border-b border-[#2a2f3d] last:border-0"
            >
              <div>
                <p className="text-xs text-[#e8eaf0] font-medium">{setting.label}</p>
                <p className="text-[10px] text-[#555c70] mt-0.5">{setting.desc}</p>
              </div>
              <div
                className="w-9 h-5 rounded-full flex items-center transition-colors duration-200 cursor-pointer flex-shrink-0"
                style={{ background: setting.on ? '#22d98a' : '#252a35', padding: '2px' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white transition-transform duration-200"
                  style={{ transform: setting.on ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}