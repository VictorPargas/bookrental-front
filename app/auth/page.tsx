"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import validarErroForm from './validar-erro-form';
import api from "../utils/xhr";
import Cookies from "js-cookie";
import { exibirToastWarn } from "../utils/alert";
import { Form } from "@unform/web";
import Image from "next/image";
import InputUnform from "../components/unform/InputUnform";
import Link from "next/link";
import { useAppDispatch } from "../hooks/redux/hooks";
import { load } from "../components/Loading";
import { setUser } from "../hooks/redux/UserSlice";
import axios from "axios";

export default function Auth() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [showPass, setShowPass] = useState(false);

    const formRef = useRef<FormHandles>(null!) as React.RefObject<FormHandles>;

    async function handleLogin<T extends { email: string; password: string }>(dados: T) {
        try {
            load.show();

            formRef.current?.setErrors({});
            await validarErroForm(dados);

            const loginData = {
                email: dados.email,
                password: dados.password,
            };

            const {
                data: { name, tokens: { accessToken } },
            } = await api.login(loginData);

            dispatch(setUser({ name, email: dados.email }));
            Cookies.set('session_token', accessToken);

            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                exibirToastWarn("Usuário ou senha inválidos. Por favor, tente novamente.");
            }
        } finally {
            load.hide();
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
                    backgroundImage: 'url("/assets/img/background.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}      
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-4">
                            <div className="card shadow-lg border-0"
                                style={{
                                    borderRadius: '1.5rem',
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                }}
                            >
                                <div className="card-body p-4 text-black"
                                    style={{ padding: '2.5rem', color: '#000' }}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-9">
                                        <Image
                                            className="logo"
                                            src="/assets/img/logo.png"
                                            width={90}
                                            height={39}
                                            alt="logo"
                                            style={{
                                                filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))',
                                                transition: 'transform 0.3s ease',
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.transform = 'scale(1.05)')
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.transform = 'scale(1)')
                                            }
                                        />
                                    </div>
                                    <Form
                                        ref={formRef}
                                        onSubmit={handleLogin}
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                        placeholder=""
                                        onPointerEnterCapture={null}
                                        onPointerLeaveCapture={null}                               >
                                        <div className="form-floating mb-4" style={{ position: 'relative' }}>
                                            <InputUnform
                                                key="email"
                                                type="email"
                                                name="email"
                                                className="form-control shadow-sm rounded-pill"
                                                placeholder="E-mail"
                                                maxLength={50}
                                                id="loginEmail"
                                                style={{
                                                    height: '45px',
                                                    fontSize: '16px',
                                                    paddingLeft: '50px',
                                                    borderRadius: '30px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f7f7f7',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => (e.currentTarget.style.border = '1px solid #6c63ff')}
                                                onBlur={(e) => (e.currentTarget.style.border = '1px solid #ccc')}
                                            />
                                            <span className="input-icon" style={{ position: 'absolute', top: '12px', left: '15px', fontSize: '18px', color: '#6c63ff' }}>
                                                <i className="uil uil-envelope" />
                                            </span>
                                        </div>
                                        <div className="form-floating password-field mb-3" style={{ position: 'relative' }}>
                                            <InputUnform
                                                key="password"
                                                type={showPass ? 'text' : 'password'}
                                                name="password"
                                                className="form-control shadow-sm rounded-pill"
                                                placeholder="Senha"
                                                maxLength={20}
                                                id="loginPassword"
                                                style={{
                                                    height: '45px',
                                                    paddingLeft: '50px',
                                                    borderRadius: '30px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f7f7f7',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => (e.currentTarget.style.border = '1px solid #6c63ff')}
                                                onBlur={(e) => (e.currentTarget.style.border = '1px solid #ccc')}
                                            />
                                            <span className="password-toggle" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', top: '25px', right: '15px', cursor: 'pointer', color: '#6c63ff' }}>
                                                {/* Toggle de visibilidade da senha */}
                                            </span>
                                            <span className="input-icon" style={{ position: 'absolute', top: '12px', left: '15px', fontSize: '18px', color: '#6c63ff' }}>
                                                <i className="uil uil-lock" />
                                            </span>
                                        </div>
                                        <div className="pt-1 mb-3">
                                            <button type="submit" className="btn btn-primary rounded-pill w-100 shadow" style={{ backgroundColor: '#6c63ff', border: 'none', height: '45px', fontSize: '16px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5b55e1')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c63ff')}>
                                                Entrar
                                            </button>
                                        </div>
                                        <Link href="/auth/forgot-password" className="hover text-muted" style={{ fontSize: '14px', textAlign: 'center', display: 'block' }}>
                                            Esqueceu sua senha?
                                        </Link>
                                        <p className="mt-4 text-center" style={{ color: '#393f81', fontSize: '14px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            Não tem uma conta?
                                            <Link href="/auth/create" className="hover" style={{ color: '#6c63ff', fontSize: '14px', textAlign: 'center', marginLeft: '5px' }}>
                                                Criar minha conta
                                            </Link>
                                        </p>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
