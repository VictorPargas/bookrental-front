import * as Yup from 'yup'

async function validarErroForm<T>(data: T) {
  const schema = Yup.object().shape({
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('E-mail inválido'),
    password: Yup.string().required('Senha é obrigatória'),
  })

  await schema.validate(data, {
    abortEarly: false,
  })
}

export default validarErroForm
