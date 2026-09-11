import type { SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Icon({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
)

export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Icon>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
)

export const ChevronUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 15l6-6 6 6" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
  </Icon>
)

export const PauseIcon = (p: IconProps) => (
  <Icon strokeWidth={3} {...p}>
    <path d="M8 5v14M16 5v14" />
  </Icon>
)

export const StopIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none" />
  </Icon>
)

export const MetronomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 3h6l4 18H5z" />
    <path d="M12 17l5-10" />
  </Icon>
)

export const MirrorIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v18" />
    <path d="M8 7l-5 5 5 5z" />
    <path d="M16 7l5 5-5 5z" />
  </Icon>
)

export const RepeatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a3 3 0 0 1 3-3h15" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a3 3 0 0 1-3 3H3" />
  </Icon>
)

export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon strokeWidth={2.5} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)

/** Half-filled circle: a step that is being learned. */
export const HalfCircleIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
  </Icon>
)

export const ExpandIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" />
  </Icon>
)
