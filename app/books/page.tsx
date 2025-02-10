"use client";

import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Badge, InputGroup } from "react-bootstrap";
import { BsFilter, BsSearch } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Book, BookApiResponse } from "@/app/types/Book";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { IconContext } from "react-icons";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import ModalBookRental from "./components/ModalBookRental";
import api from "../utils/xhr";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Filtros
  const [category, setCategory] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  
  // Paginação
  const [currentPage, setCurrentPage] = useState<number>(0);
  const booksPerPage = 12; // Quantidade de livros por página

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.getAllBooks();
        const booksData: Book[] = response.data.map((book: BookApiResponse) => ({
          id: book.id,
          title: book.title,
          isbn: book.isbn,
          year: book.yearPublished,
          quantity: book.quantityAvailable,
          publisher: book.publisherName,
          authors: book.authors.join(", "), 
          isAvailable: book.isAvailable,
        }));
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch  {
        toast.error("Erro ao carregar os livros.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.authors.toLowerCase().includes(search.toLowerCase()) ||
        book.isbn.includes(search)
    );

    if (category !== "all") {
      filtered = filtered.filter((book) => book.publisher === category);
    }

    if (availability !== "all") {
      filtered = filtered.filter((book) =>
        availability === "available" ? book.quantity > 0 : book.quantity === 0
      );
    }

    if (year !== "all") {
      filtered = filtered.filter((book) => book.year.toString() === year);
    }

    setFilteredBooks(filtered);
    setCurrentPage(0);
  }, [search, category, availability, year, books]);

  // Lógica de paginação
  const pageCount = Math.ceil(filteredBooks.length / booksPerPage);
  const offset = currentPage * booksPerPage;
  const currentBooks = filteredBooks.slice(offset, offset + booksPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid mt-5">
      <motion.h1 className="mb-4 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
        <span role="img" aria-label="book">📚</span> Biblioteca Online
      </motion.h1>

       {/* 🔍 Barra de Pesquisa e Filtros */}
       <div className="mb-4 p-3 bg-light rounded shadow-sm">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={6} lg={4}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-primary text-white border-0">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por título, autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0"
              />
            </InputGroup>
          </Col>
          
          <Col xs={12} md={6} lg={2}>
            <Form.Select 
              className="shadow-sm border-0" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Todas as Editoras</option>
              <option value="HarperCollins">HarperCollins</option>
              <option value="Bloomsbury">Bloomsbury</option>
              <option value="Doubleday">Doubleday</option>
              <option value="Companhia das Letras">Companhia das Letras</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={6} lg={2}>
            <Form.Select 
              className="shadow-sm border-0" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">Todos os Anos</option>
              <option value="1954">1954</option>
              <option value="1997">1997</option>
              <option value="2003">2003</option>
              <option value="2020">2020</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={6} lg={2}>
            <Form.Select 
              className="shadow-sm border-0" 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="available">Disponível</option>
              <option value="unavailable">Indisponível</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={12} lg={2}>
            <Button variant="primary" className="w-100 shadow-sm d-flex align-items-center justify-content-center gap-2">
              <BsFilter /> Filtrar
            </Button>
          </Col>
        </Row>
      </div>

      {/* 📚 Grid de Livros */}
      {isLoading ? (
        <Row className="g-4">
          {Array.from({ length: booksPerPage }).map((_, i) => (
            <Col key={i} xs={12} sm={6} md={4} lg={3}>
              <Card className="book-card">
                <Skeleton height={220} />
                <Card.Body className="text-center">
                  <Skeleton count={2} />
                  <Skeleton width="60%" />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Row className="g-4">
            {currentBooks.length > 0 ? (
              currentBooks.map((book, index) => (
                <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="book-card position-relative">
                      <div className="book-cover">
                        <img
                          src={book.image || "/OIP.jpeg"}
                          alt={book.title}
                          className="book-image"
                        />
                        <Badge 
                          bg={book.isAvailable ? "success" : "danger"} 
                          className="position-absolute top-0 start-0 m-2"
                        >
                          {book.isAvailable ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                      <Card.Body className="text-center d-flex flex-column">
                        <div>
                          <Card.Title className="fw-bold fs-6">{book.title}</Card.Title>
                          <Card.Text className="text-muted">{book.authors}</Card.Text>
                        </div>

                        <Button 
                            variant="primary" 
                            className="btn-sm w-100 mt-auto"
                            onClick={() => {
                                setSelectedBook(book);
                                setShowModal(true);
                            }}
                        >
                            Ver Detalhes
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))
            ) : (
              <p className="text-center text-danger">Nenhum livro encontrado.</p>
            )}
          </Row>

          <ModalBookRental
            show={showModal}
            onHide={() => setShowModal(false)}
            book={selectedBook}
          />

          {/* 📌 Paginação */}
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={
                <IconContext.Provider value={{ color: "#495057", size: "24px" }}>
                  <AiFillLeftCircle />
                </IconContext.Provider>
              }
              nextLabel={
                <IconContext.Provider value={{ color: "#495057", size: "24px" }}>
                  <AiFillRightCircle />
                </IconContext.Provider>
              }
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              disabledClassName="disabled"
              previousClassName="prev"
              nextClassName="next"
            />
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
