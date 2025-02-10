"use client";

import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { BsBookHalf, BsArrowRepeat, BsBoxArrowLeft } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/utils/xhr";
import { Book } from "@/app/types/Book";

interface Rental {
  rentalId: number;
  userId: number;
  bookId: number;
  rentalDate: string;
  expectedReturnDate: string;
  status: string;
  userIdentifier: string;
  userName: string;
}

export default function MyRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyRentals();
    fetchBooks();
  }, []);

  const fetchMyRentals = async () => {
    try {
      const response = await api.MyRentals();
      setRentals(response.data);
    } catch  {
      toast.error("Erro ao carregar suas locacões.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.getAllBooks();
      setBooks(response.data);
    } catch {
      toast.error("Erro ao carregar os livros.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : "Livro não encontrado";
  };

  const handleRenewRental = async (rentalId: number) => {
    try {
      await api.renewRental(rentalId, {});
      toast.success("Locação renovada com sucesso!");
      fetchMyRentals();
    } catch  {
      toast.error("Erro ao renovar a locação.");
    }
  };

  const handleReturnRental = async (rentalId: number) => {
    try {
      await api.returnRental(rentalId);
      toast.success("Livro devolvido com sucesso!");
      fetchMyRentals();
    } catch  {
      toast.error("Erro ao devolver o livro.");
    }
  };

  return (
    <div className="container-fluid mt-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-center fw-bold mb-4">
        <BsBookHalf className="me-2" /> Meus Alugueis de Livros
      </h2>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          {rentals.length > 0 ? (
            rentals.map((rental) => (
              <Col key={rental.rentalId} xs={12} md={6} lg={4}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">{getBookTitle(rental.bookId)}</Card.Title>
                    <Card.Text>
                      <strong>Data de Empréstimo:</strong> {new Date(rental.rentalDate).toLocaleDateString()}<br />
                      <strong>Previsão de Devolução:</strong> {new Date(rental.expectedReturnDate).toLocaleDateString()}<br />
                      <strong>Status:</strong> <Badge bg={rental.status === "Em Andamento" ? "info" : "secondary"}>{rental.status}</Badge>
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="info" onClick={() => handleRenewRental(rental.rentalId)}>
                        <BsArrowRepeat /> Renovar
                      </Button>
                      <Button variant="danger" onClick={() => handleReturnRental(rental.rentalId)}>
                        <BsBoxArrowLeft /> Devolver
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">Você não tem livros alugados no momento.</p>
          )}
        </Row>
      )}
    </div>
  );
}