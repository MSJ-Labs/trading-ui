interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'ghost'
}

export default function Button({ loading, variant = 'primary', children, disabled, ...props }: ButtonProps) {
  const base = 'w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50'
  const variants = {
    primary: 'bg-accent text-black',
    ghost: 'border border-line text-muted',
  }

  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}