"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form, ProgressBar, Badge, Alert } from "react-bootstrap";
import { Book } from "@/app/types/Book";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "@/app/utils/xhr";
import { BsCalendarCheck, BsInfoCircle } from "react-icons/bs";

interface ModalBookRentalProps {
  show: boolean;
  onHide: () => void;
  book: Book | null;
}

export default function ModalBookRental({ show, onHide, book }: ModalBookRentalProps) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.getUserProfile();
      setUserId(response.data.id);
    } catch {
      toast.error("Erro ao obter informações do usuário.");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleRental = async () => {

    if (!expectedReturnDate) {
      toast.error("Por favor, selecione a data prevista de devolução.");
      return;
    }

    const rentalData = {
      userId: userId,
      bookId: book?.id,
      dueDate: expectedReturnDate.toISOString(), // Apenas a data de devolução é enviada
    };

    console.log("rentalData", rentalData);

     try {
       await api.registerRental(rentalData);
       toast.success(`Livro \"${book?.title}\" alugado com devolução prevista para ${expectedReturnDate.toLocaleDateString()}!`);
       onHide();
       resetForm();
     } catch (error) {
       toast.error("Erro ao registrar o aluguel.");
       console.error("Erro:", error);
     }
  };

  const resetForm = () => {
    setStep(1);
    setExpectedReturnDate(null);
  };

  const progress = (step / 2) * 100;  // Apenas duas etapas agora

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="rounded-modal">
      <Modal.Header closeButton className="rounded-top">
        <Modal.Title className="d-flex align-items-center gap-2">
          <BsCalendarCheck size={24} /> Registrar Aluguel de Livro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <ProgressBar now={progress} className="mb-4" style={{ height: '8px', borderRadius: '50px' }} variant="info" />

        {step === 1 && (
          <div className="d-flex flex-column align-items-center text-center">
            <div className="position-relative mb-4">
              <img
                src={book?.image || "/OIP.jpeg"}
                alt={book?.title}
                className="rounded shadow-lg"
                style={{ width: "200px", height: "280px", objectFit: "cover", borderRadius: "15px" }}
              />
              <Badge bg={book?.isAvailable ? "success" : "danger"} className="position-absolute top-0 start-0 m-2">
                {book?.isAvailable ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
            <h3 className="fw-bold mb-1">{book?.title}</h3>
            <p className="text-muted mb-2">{book?.authors} <span className="mx-1">|</span> {book?.publisher}</p>
            <Button variant="primary" className="mt-3 w-75 rounded-pill shadow-sm" onClick={nextStep} disabled={book?.quantity === 0}>
              Alugar Agora
            </Button>
          </div>
        )}

        {step === 2 && (
          <Form>
            <Alert variant="info" className="d-flex align-items-center">
              <BsInfoCircle className="me-2" /> Selecione a data prevista para devolução.
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Data Prevista de Devolução</Form.Label>
              <DatePicker
                selected={expectedReturnDate}
                onChange={(date) => setExpectedReturnDate(date)}
                minDate={new Date()} // Não permite selecionar datas passadas
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={prevStep}>Voltar</Button>
              <Button variant="primary" onClick={handleRental} disabled={!expectedReturnDate}>
                Confirmar Aluguel
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
