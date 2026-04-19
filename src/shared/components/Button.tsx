interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'ghost'
}

export default function Button({ loading, variant = 'primary', children, disabled, className = '', ...props }: ButtonProps) {
  const base = 'rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50'
  const variants = {
    primary: 'w-full bg-accent text-black',
    ghost: 'border border-line text-muted',
  }

  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}