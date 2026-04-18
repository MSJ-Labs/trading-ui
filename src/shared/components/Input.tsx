interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-muted">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border border-line bg-raised text-white focus:border-accent transition-colors"
      />
    </div>
  )
}