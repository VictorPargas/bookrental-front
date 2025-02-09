import { ReactElement, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  row?: boolean
  className?: string
  children: ReactElement
}

const FormGroup = ({
  children,
  row,
  className,
  ...rest
}: Props): ReactElement => (
  <div
    className={`form-group m-form__group ${row ? 'row' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
)

export default FormGroup
