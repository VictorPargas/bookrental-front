import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';
import get from 'lodash/get'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { ValidationError } from 'yup'
import { RefObject } from 'react';

type ErrorCatch = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

interface Erros {
  [key: string]: string
}

function validateUnform(err: ValidationError): Erros {
  const validacaoDeErros: Erros = {}

  err.inner.forEach((error) => {
    if (error.path) {
      validacaoDeErros[error.path] = error.message
    }
  })

  return validacaoDeErros
}

export function exibirToastSuccess(
  mensagem: string,
  config?: ToastOptions,
): ReturnType<typeof toast.success> {
  return toast.success(mensagem, config);
}

export function exibirToastWarn(mensagem: string, config?: ToastOptions) {
  return toast.warn(mensagem, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      backgroundColor: "#fff3cd", 
      color: "#856404",          
      border: "1px solid #ffeeba",
      borderRadius: "10px",
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
    },
    ...config,
  });
}

export function exibirToastError(mensagem: string, config?: ToastOptions) {
  return toast.error(mensagem, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "10px",
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
    },
    ...config,
  });
}

export function exibirErrorCatch(
  e: unknown,
  formRef?: RefObject<FormHandles>,
): void {
  if (formRef && e instanceof Yup.ValidationError) {
    const erros = validateUnform(e);
    formRef.current?.setErrors(erros);
    return;
  }

  const err = e as ErrorCatch;
  const message = 'Algo deu errado, tente novamente mais tarde';

  if (Array.isArray(err?.response?.data?.message)) {
    err.response.data.message.forEach((msg: string) => {
      toast.error(msg);
    });
    return;
  }

  if (err?.response?.data?.message) {
    toast.error(get(err, 'response.data.message', message));
    return;
  }

  if (err?.message) {
    toast.error(get(err, 'message', message));
    return;
  }

  toast.error(get(err, 'response.data.message', message));
} 
