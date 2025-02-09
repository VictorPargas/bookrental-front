import invariant from 'invariant'

const getElementById = (id: string): HTMLElement => {
  const element = document.getElementById(id)
  invariant(element, `Element ${id} não encontrado no documento`)
  return element
}

export default getElementById
