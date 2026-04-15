import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Modal } from '../components/ui/Modal';
import { FormField, Input } from '../components/ui/FormField';
import { triggerAnomalyToast } from '../components/ui/AnomalyToast';

interface Tier {
  name:     'starter' | 'growth' | 'pro';
  price:    string;
  priceNum: number;
  sub:      string;
  color:    string;
  popular:  boolean;
  features: string[];
  cta:      string;
}

const TIERS: Tier[] = [
  {
    name: 'starter', price: 'Free', priceNum: 0, sub: 'forever',
    color: '#8b90a0', popular: false,
    features: [
      '1 store connected',
      '30-day data history',
      'Core dashboard',
      'CSV export',
      'Email support',
    ],
    cta: 'Get started free',
  },
  {
    name: 'growth', price: '$19', priceNum: 19, sub: 'per month',
    color: '#22d98a', popular: true,
    features: [
      '3 stores connected',
      '90-day data history',
      'Everything in Starter',
      'Anomaly alerts',
      'Scheduled email reports',
      'Priority support',
    ],
    cta: 'Upgrade to Growth',
  },
  {
    name: 'pro', price: '$49', priceNum: 49, sub: 'per month',
    color: '#4d9cf8', popular: false,
    features: [
      'Unlimited stores',
      'Full data history',
      'Everything in Growth',
      'Real-time order feed',
      'API access',
      'Custom anomaly rules',
      'Dedicated support',
    ],
    cta: 'Upgrade to Pro',
  },
];

interface PaymentForm {
  cardName:   string;
  cardNumber: string;
  expiry:     string;
  cvv:        string;
}

const EMPTY_FORM: PaymentForm = {
  cardName:   '',
  cardNumber: '',
  expiry:     '',
  cvv:        '',
};

export function PricingPage() {
  const navigate = useNavigate();
  const { isAuth, user, upgradePlan } = useAuthStore();

  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [form,         setForm]         = useState<PaymentForm>(EMPTY_FORM);
  const [processing,   setProcessing]   = useState(false);
  const [errors,       setErrors]       = useState<Partial<PaymentForm>>({});

  function handleSelectTier(tier: Tier) {
    if (!isAuth) {
      navigate('/register');
      return;
    }
    if (tier.priceNum === 0) {
      navigate('/app');
      return;
    }
    setSelectedTier(tier);
  }

  function formatCardNumber(val: string): string {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string): string {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  }

  function validate(): boolean {
    const e: Partial<PaymentForm> = {};
    if (!form.cardName.trim())                          e.cardName   = 'Name is required';
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid card number required';
    if (form.expiry.length < 5)                         e.expiry     = 'Valid expiry required';
    if (form.cvv.length < 3)                            e.cvv        = 'Valid CVV required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePayment() {
    if (!validate() || !selectedTier) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));

    upgradePlan(selectedTier.name);
    setProcessing(false);
    setSelectedTier(null);
    setForm(EMPTY_FORM);
    triggerAnomalyToast(`✓ Upgraded to ${selectedTier.name.charAt(0).toUpperCase() + selectedTier.name.slice(1)} plan!`);
    navigate('/app');
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link to="/">
          <span
            className="font-['Syne',sans-serif] text-lg font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            merchant<span className="text-emerald-400">.</span>analytics
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuth ? (
            <Link
              to="/app"
              className="text-sm px-4 py-1.5 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
            >
              Go to dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-3 py-1.5 rounded-lg transition-all"
                style={{ color: 'var(--text2)', border: '1px solid var(--border)' }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="font-mono text-[11px] tracking-widest uppercase mb-3"
            style={{ color: 'var(--text3)' }}
          >
            Pricing
          </p>
          <h1
            className="font-['Syne',sans-serif] text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Start free. Scale when you're ready.
          </h1>
          <p className="text-base mt-3" style={{ color: 'var(--text2)' }}>
            No credit card required to start. Cancel anytime.
          </p>

          {/* Current plan badge */}
          {isAuth && user && (
            <div
              className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
              }}
            >
              <span>Current plan:</span>
              <span
                className="font-medium capitalize"
                style={{ color: '#22d98a' }}
              >
                {user.plan}
              </span>
            </div>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isCurrent = isAuth && user?.plan === tier.name;

            return (
              <div
                key={tier.name}
                className="rounded-xl p-6 flex flex-col gap-5 relative"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: tier.popular
                    ? `2px solid ${tier.color}`
                    : '1px solid var(--border)',
                }}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-medium px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: tier.color, color: '#0d0f12' }}
                  >
                    Most popular
                  </div>
                )}

                {isCurrent && (
                  <div
                    className="absolute -top-3 right-4 font-mono text-[10px] font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--surface3)', color: 'var(--text2)', border: '1px solid var(--border)' }}
                  >
                    Current plan
                  </div>
                )}

                <div>
                  <p
                    className="font-['Syne',sans-serif] text-sm font-semibold mb-3 capitalize"
                    style={{ color: 'var(--text)' }}
                  >
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-['Syne',sans-serif] text-4xl font-bold tracking-tight"
                      style={{ color: tier.color }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>
                      {tier.sub}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text2)' }}
                    >
                      <span style={{ color: tier.color }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectTier(tier)}
                  disabled={isCurrent}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isCurrent
                      ? 'var(--surface3)'
                      : tier.popular ? tier.color : 'transparent',
                    color: isCurrent
                      ? 'var(--text3)'
                      : tier.popular ? '#0d0f12' : tier.color,
                    border: isCurrent
                      ? 'none'
                      : tier.popular ? 'none' : `1px solid ${tier.color}`,
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent && !tier.popular) {
                      e.currentTarget.style.backgroundColor = tier.color + '22';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent && !tier.popular) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {isCurrent ? 'Current plan' : tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2
            className="font-['Syne',sans-serif] text-2xl font-bold text-center mb-10 tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes. You can change your plan at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards including Visa, Mastercard, and American Express. Mobile money support coming soon for African markets.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes — both Growth and Pro plans come with a 14-day free trial. No credit card needed to start the trial.',
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your data is retained for 30 days after cancellation. You can export everything to CSV before your account closes.',
              },
              {
                q: 'Do you support African currencies?',
                a: 'Yes. We support ZMW, KES, NGN, GHS, ZAR and more. Your dashboard can display values in your local currency.',
              },
              {
                q: 'Is the Starter plan really free forever?',
                a: 'Yes. The Starter plan is free with no time limit. We only ask you to upgrade when you need more stores, longer history, or advanced features.',
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  {item.q}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text2)' }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedTier && (
        <Modal
          title={`Upgrade to ${selectedTier.name.charAt(0).toUpperCase() + selectedTier.name.slice(1)}`}
          onClose={() => { setSelectedTier(null); setForm(EMPTY_FORM); setErrors({}); }}
        >
          <div className="flex flex-col gap-4">

            {/* Order summary */}
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text2)' }}>
                  {selectedTier.name.charAt(0).toUpperCase() + selectedTier.name.slice(1)} plan
                </span>
                <span
                  className="font-['Syne',sans-serif] text-sm font-bold"
                  style={{ color: selectedTier.color }}
                >
                  {selectedTier.price}/mo
                </span>
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>
                Billed monthly · Cancel anytime
              </p>
            </div>

            {/* Card form */}
            <FormField label="Name on card" error={errors.cardName}>
              <Input
                type="text"
                placeholder="Alex Mwale"
                value={form.cardName}
                onChange={(e) => setForm({ ...form, cardName: e.target.value })}
              />
            </FormField>

            <FormField label="Card number" error={errors.cardNumber}>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                }
                maxLength={19}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Expiry" error={errors.expiry}>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) =>
                    setForm({ ...form, expiry: formatExpiry(e.target.value) })
                  }
                  maxLength={5}
                />
              </FormField>
              <FormField label="CVV" error={errors.cvv}>
                <Input
                  type="text"
                  placeholder="123"
                  value={form.cvv}
                  onChange={(e) =>
                    setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                  }
                  maxLength={4}
                />
              </FormField>
            </div>

            {/* SSL notice */}
            <p className="text-[10px] text-center" style={{ color: 'var(--text3)' }}>
              🔒 Payments are secured with 256-bit SSL encryption
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => { setSelectedTier(null); setForm(EMPTY_FORM); setErrors({}); }}
                className="flex-1 py-2 rounded-lg text-xs transition-all"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: processing ? 'var(--surface3)' : '#22d98a',
                  color:           processing ? 'var(--text3)'    : '#0d0f12',
                  cursor:          processing ? 'not-allowed'     : 'pointer',
                }}
              >
                {processing
                  ? 'Processing...'
                  : `Pay ${selectedTier.price}/mo`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}