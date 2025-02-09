"use client";

import { useState } from "react";
import { Modal, Button, Form, ProgressBar, Badge } from "react-bootstrap";
import { Book } from "@/app/types/Book";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalBookRentalProps {
  show: boolean;
  onHide: () => void;
  book: Book | null;
}

export default function ModalBookRental({ show, onHide, book }: ModalBookRentalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleRental = () => {
    if (!name.trim()) {
      toast.error("Por favor, insira seu nome.");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Por favor, selecione o período de aluguel.");
      return;
    }

    const rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (rentalDays <= 0) {
      toast.error("A data de término deve ser após a data de início.");
      return;
    }

    toast.success(`Livro \"${book?.title}\" alugado de ${startDate.toLocaleDateString()} até ${endDate.toLocaleDateString()}!`);
    onHide();
    setStep(1); // Resetar o step após o aluguel
  };

  const progress = (step / 3) * 100;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="rounded-modal">
      <Modal.Header closeButton className=" rounded-top">
        <Modal.Title className="d-flex align-items-center gap-2">
          <span role="img" aria-label="book">📚</span> Registrar Aluguel de Livro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <ProgressBar now={progress} className="mb-4" style={{ height: '8px', borderRadius: '50px'}} />

        {step === 1 && (
          <div className="d-flex flex-column align-items-center text-center">
          <div className="position-relative mb-4">
            <img
              src={book?.image || "/OIP.jpeg"}
              alt={book?.title}
              className="rounded shadow-lg"
              style={{ width: "200px", height: "280px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Badge bg={book?.quantity > 0 ? "success" : "danger"} className="position-absolute top-0 start-0 m-2">
              {book?.quantity > 0 ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
          <h3 className="fw-bold mb-1">{book?.title}</h3>
          <p className="text-muted mb-2">{book?.author} <span className="mx-1">|</span> {book?.publisher}</p>
          <Button variant="primary" className="mt-3 w-75 rounded-pill shadow-sm" onClick={nextStep} disabled={book?.quantity === 0}>
            Alugar Agora
          </Button>
        </div>
        )}

        {step === 2 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seu Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={prevStep}>Voltar</Button>
              <Button variant="primary" onClick={nextStep} disabled={!name.trim()}>Próximo</Button>
            </div>
          </Form>
        )}

        {step === 3 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Data de Início</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de Término</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={prevStep}>Voltar</Button>
              <Button variant="primary" onClick={handleRental}>Confirmar Aluguel</Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
