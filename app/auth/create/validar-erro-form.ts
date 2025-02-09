import * as Yup from 'yup'

export async function validarErroFormCreate<T>(data: T, token: string | null) {
  const schema = Yup.object().shape({
    name: Yup.string()
      .matches(
        /[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ']\s[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ']+/,
        'Insira o nome completo',
      )
      .min(2, 'Mínimo de 2 caracteres')
      .max(80, 'Máximo de 80 caracteres')
      .trim()
      .required('Nome completo é obrigatório')
      .test(
        'is-not-blank',
        'Este campo não pode conter apenas espaços vazios',
        (value) => value?.trim() !== '',
      ),
    email: Yup.string()
      .email('E-mail inválido')
      .required('E-mail obrigatório')
      .test(
        'is-not-blank',
        'Este campo não pode conter apenas espaços vazios',
        (value) => value?.trim() !== '',
      ),
    password: Yup.string()
      .min(6, 'Mínimo de 6 caracteres')
      .max(80, 'Máximo de 80 caracteres')
      .required('Este campo é obrigatório'),
    phone: token
      ? Yup.string()
          .matches(/^\d{10,11}$/, 'Número de telefone inválido')
          .required('Telefone é obrigatório')
      : Yup.string().notRequired(),
  })

  await schema.validate(data, {
    abortEarly: false,
  })
}
