import styles from './IconButton.module.css'

type IconButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  icon: string
  ariaLabel: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  height?: string | number
  width?: string | number
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  ariaLabel,
  disabled = false,
  type = 'button',
  width = '50px',
  height = '50px',
}) => (
  <button
    type={type}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    className={styles.button}
    style={{ width, height }}
  >
    <img src={icon} alt="icon" />
  </button>
)

export default IconButton
