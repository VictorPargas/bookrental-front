'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { load } from '@/app/components/Loading' 
import api from "../../utils/xhr";  
import Cookies from 'js-cookie'  
import { exibirToastSuccess, exibirErrorCatch, exibirToastError } from '@/app/utils/alert'
import InputUnform from '@/app/components/unform/InputUnform'

interface DataForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Create() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)

  // Corrigindo a tipagem do useRef
  const formRef = useRef<FormHandles>(null) as React.RefObject<FormHandles>;

  async function handleLogin(dados: DataForm) {
    try {
      load.show()

      const dataFormated = {
        ...dados,
        phone: dados?.phone?.replace(/\D/g, ''),  
      }

      const response = await api.registerUser(dataFormated)
      const { tokens: { accessToken } } = response.data

      Cookies.set('session_token', accessToken);

      exibirToastSuccess('Usuário cadastrado com sucesso!')
      exibirToastSuccess('Redirecionando para sua conta...', { autoClose: 3000 })

      setTimeout(() => {
        router.push('/books')
      }, 3000)
      
    } catch (error: unknown) {
      const typedError = error as { response: { data: { errors: string[] } } };
      if (typedError.response && typedError.response.data?.errors) {
        typedError.response.data.errors.forEach((errMsg: string) => {
          exibirToastError(errMsg);  // Exibindo cada erro no toast
        });
      } else {
        exibirErrorCatch(error, formRef); 
      }
    } finally {
      load.hide()
    }
  }

  return (
    <div className="content-wrapper">
      <section
        className="vh-100 d-flex justify-content-center align-items-center"
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(\"/assets/img/background.jpg\")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-4">
              <div className="card shadow-lg border-0" style={{ borderRadius: '1.5rem', background: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="card-body p-4 text-black" style={{ color: '#000' }}>
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <Image src="/assets/img/logo-dark.png" width={90} height={39} alt="Logo" />
                  </div>

                  {/* Formulário */}
                  <Form
                    ref={formRef}
                    onSubmit={handleLogin}
                    className="text-start mb-3"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <div className="form-floating mb-4">
                      <InputUnform
                        key="name"
                        id="name"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nome"
                        maxLength={80}
                      />
                      <label htmlFor="name">Nome e sobrenome</label>
                    </div>

                    <div className="form-floating mb-4">
                      <InputUnform
                        key="email"
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="E-mail"
                        maxLength={50}
                      />
                      <label htmlFor="email">E-mail</label>
                    </div>

                    <div className="form-floating mb-4">
                      <InputUnform
                        key="phone"
                        id="phone"
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="WhatsApp"
                        maxLength={15}
                      />
                      <label htmlFor="phone">Telefone</label>
                    </div>

                    <div className="form-floating mb-4">
                      <InputUnform
                        key="password"
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        className="form-control"
                        placeholder="Senha"
                        maxLength={20}
                      />
                      <span className="password-toggle" onClick={() => setShowPass(!showPass)}>
                        <i className={`uil ${showPass ? 'uil-eye' : 'uil-eye-slash'}`} />
                      </span>
                      <label htmlFor="password">Senha</label>
                    </div>

                    <button type="submit" className="btn btn-primary rounded-pill w-100">
                      Criar conta
                    </button>
                  </Form>

                  <div className="text-center mt-4">
                    <p style={{ color: '#393f81', fontSize: '14px' }}>
                      Já tem uma conta?{' '}
                      <Link href="/auth" style={{ color: '#6c63ff' }}>
                        Entrar
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

