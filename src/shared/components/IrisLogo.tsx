interface Props {
  iconSize?: number
  showWordmark?: boolean
  className?: string
}

export default function IrisLogo({ iconSize = 36, showWordmark = true, className = '' }: Props) {
  const h = iconSize * 0.65

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={iconSize} height={h} viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 13 C8 2 32 2 38.5 13 C32 24 8 24 1.5 13 Z"
          stroke="#00d4b8"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="13" r="6.5" stroke="#00d4b8" strokeWidth="1.6" />
        <circle cx="20" cy="13" r="2.8" fill="#00d4b8" />
        <circle cx="22.8" cy="10.2" r="1.1" fill="#00d4b8" opacity="0.45" />
      </svg>
      {showWordmark && (
        <span
          style={{ fontSize: iconSize * 0.55, letterSpacing: '-0.02em' }}
          className="font-bold text-accent leading-none"
        >
          Iris
        </span>
      )}
    </div>
  )
}