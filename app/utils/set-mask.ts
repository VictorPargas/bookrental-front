'use client'

import Inputmask from 'inputmask'
import getInputById from './get-input-by-id'
import { Mask } from '../types/Mask'

const getMask = async (id: string, params: Inputmask.Options) => {
  try {
    const inputmaskModule = await import('inputmask')

    const Inputmask = inputmaskModule.default

    const inputElement = getInputById(id)

    if (inputElement) {
      Inputmask(params).mask(inputElement)
    }
  } catch (error) {
    console.error('Erro ao importar o módulo:', error)
  }
}

export const setMask = (id: string, mask?: Mask) => {
  switch (mask) {
    case 'money':
      getMask(id, {
        alias: 'currency',
        radixPoint: ',',
        prefix: 'R$ ',
        groupSeparator: '.',
        digits: 2,
        digitsOptional: false,
        placeholder: '0',
        rightAlign: false,
      })
      break

    case 'cpf':
      getMask(id, { mask: ['999.999.999-99'] })
      break

    case 'cnpj':
      getMask(id, { mask: ['99.999.999/9999-99'] })
      break

    case 'cep':
      getMask(id, { mask: ['99.999-999'] })
      break

    case 'date':
      getMask(id, { mask: ['99/99/9999'] })
      break

    case 'phone':
      getMask(id, { mask: ['(99) 9999-9999', '(99) 99999-9999'] })
      break

    case 'card':
      getMask(id, { mask: ['9999 9999 9999 9999'] })
      break

    default:
      break
  }
}
