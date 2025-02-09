'use client'

import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEventHandler,
} from 'react'
import { useField } from '@unform/core'
import { setMask } from '../../utils/set-mask'
import { Mask } from '../../types/Mask'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  className?: string
  id: string
  onInput?: FormEventHandler
  mask?: Mask
}

const InputUnform: React.FC<InputProps> = ({
  name,
  mask,
  onInput,
  ...props
}) => {
  const [showProgress, setShowProgress] = useState(false)
  const [totalChar, setTotalChar] = useState(
    String(props?.defaultValue || '').length,
  )

  const inputRef = useRef(null)

  const { fieldName, defaultValue, error, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  useEffect(() => {
    setMask(props.id, mask)
  }, [props.id, mask])

  const length = totalChar / (Number(props.maxLength) / 100) || 0

  return (
    <>
      <input
        ref={inputRef}
        defaultValue={defaultValue}
        {...props}
        onFocus={() => setShowProgress(true)}
        onBlur={() => setShowProgress(false)}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          setTotalChar(e.target.value.length)
          if (onInput) {
            onInput(e)
          }
        }}
      />

      {showProgress ? (
        <div className="progress mt-2" style={{ height: 2 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${length}%` }}
            aria-valuenow={totalChar}
            aria-valuemin={0}
            aria-valuemax={Number(props.maxLength)}
            aria-labelledby="progressbar-label"
          />
        </div>
      ) : (
        <div className="mt-2" style={{ height: 2 }} />
      )}

      <span className="text-danger">{error}</span>
    </>
  )
}

export default InputUnform
