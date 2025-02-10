import { useRef, ChangeEvent } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Col,
  FormGroup,
} from 'react-bootstrap'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { load, } from '@/app/components/Loading'
import { exibirToastSuccess } from '@/app/utils/alert'
import { validarErroFormCreate } from './validar-erro-form'
import api from '@/app/utils/xhr'
import InputUnform from '@/app/components/unform/InputUnform'
import { toast } from 'react-toastify'

interface Props {
  show: boolean
  closeModal: () => void
}

export function ModalCreate({ show, closeModal }: Props) {
  const formRef = useRef<FormHandles>(null)

  async function handleCriate<T>(dados: T) {
    try {
      load.show()

      formRef.current?.setErrors({})
      await validarErroFormCreate(dados)

      await api.registerUser(dados)

      exibirToastSuccess('Usuário cadastrado com sucesso')
      closeModal()
    } catch {
      toast.error("Erro")
    } finally {
      load.hide()
    }
  }

  return (
    <Modal show={show}>
      <ModalHeader className="d-flex justify-content-center align-items-center">
        <div className="d-flex justify-content-center align-items-center flex-column">
          <h3 className="text-dark">Inscrever-se</h3>
          <h6 className="text-secondary">É rápido e fácil.</h6>
        </div>
      </ModalHeader>
      <ModalBody>
        <Form 
          ref={formRef}
          onSubmit={handleCriate} 
          placeholder="" 
          onPointerEnterCapture={null}
          onPointerLeaveCapture={null}>
          <FormGroup className="form-outline mb-4">
            <Col col={12}>
              <InputUnform
                key="name"
                type="text"
                id="name"
                name="name"
                className="form-control form-control-user"
                placeholder="Nome"
                maxLength={80}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  formRef.current?.setFieldValue(
                    'name',
                    e.target.value.replace(
                      /[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ'\s]+/g,
                      '',
                    ),
                  )
                }
              />
            </Col>
          </FormGroup>

          <FormGroup className="form-outline mb-4">
            <Col col={12}>
              <InputUnform
                key="email"
                id="email"
                type="email"
                name="email"
                className="form-control form-control-user"
                placeholder="E-mail"
                maxLength={100}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  formRef.current?.setFieldValue(
                    'email',
                    e.target.value.replace(/[^a-zA-Z\d\-_@.]+/g, ''),
                  )
                }
              />
            </Col>
          </FormGroup>

          <FormGroup className="form-outline mb-4">
            <Col col={12}>
              <InputUnform
                key="password"
                id="password"
                type="password"
                name="password"
                className="form-control form-control-user"
                placeholder="Senha"
                maxLength={80}
              />
            </Col>
          </FormGroup>
          <ModalFooter>
            <button
              className="btn btn-secondary btn-block fa-lg"
              type="button"
              onClick={closeModal}
            >
              Voltar
            </button>
            <button className="btn btn-primary btn-block fa-lg" type="submit">
              Criar
            </button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  )
}
