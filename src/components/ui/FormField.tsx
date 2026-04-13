interface FormFieldProps {
  label:       string;
  required?:   boolean;
  children:    React.ReactNode;
  error?:      string;
}

export function FormField({ label, required, children, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono text-[10px] tracking-widest uppercase"
        style={{ color: 'var(--text3)' }}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-3 py-2 text-xs outline-none transition-colors"
      style={{
        backgroundColor: 'var(--surface2)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--border2)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export function Select({ options, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className="w-full rounded-lg px-3 py-2 text-xs outline-none transition-colors"
      style={{
        backgroundColor: 'var(--surface2)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}