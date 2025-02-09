"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { Button, Modal, Form, OverlayTrigger, Tooltip, InputGroup } from "react-bootstrap";
import { BsTrashFill, BsPencilFill, BsPlusLg } from "react-icons/bs";
import { SkeletonTable } from "@/app/components/SkeletonTable";
import { Book, BookApiResponse, Author, Publisher } from "@/app/types/Book";
import { toast, ToastContainer } from "react-toastify";
import api from "../utils/xhr";
import "react-toastify/dist/ReactToastify.css";
import { number } from "yup";

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newPublisher, setNewPublisher] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.getAllBooks();
      console.log("response", response);
      const booksData: Book[] = response.data.map((book: BookApiResponse) => ({
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        year: book.yearPublished,
        quantity: book.quantityAvailable,
        publisher: book.publisherName,
        publisherId: book.publisherId,  // Assumindo que o backend retorna isso
        authors: book.authors.join(", "),
        authorIds: book.authorIds,      // Assumindo que o backend retorna isso
      }));
      setBooks(booksData);
      console.log(booksData);
    } catch (error) {
      toast.error("Erro ao carregar os livros.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorsResponse, publishersResponse] = await Promise.all([
        api.getAllAuthors(),
        api.getAllPublishers(),
      ]);

      setAuthors(authorsResponse.data);
      setPublishers(publishersResponse.data);
    } catch (error) {
      toast.error("Erro ao carregar autores e editoras.");
    }
  };

  const handleShowModal = async (book: Book | null = null) => {
    setSelectedBook(book);
    setIsEditing(!!book);
    setShowModal(true);
    await fetchAuthorsAndPublishers();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setIsEditing(false);
    setNewAuthor("");
    setNewPublisher("");
  };

  const handleCreateAuthor = async () => {
    try {
      const response = await api.createAuthor({ name: newAuthor });
      setAuthors((prev) => [...prev, response.data]);
      setNewAuthor("");
      toast.success("Autor adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar autor.");
    }
  };

  const handleCreatePublisher = async () => {
    try {
      const response = await api.createPublisher({ name: newPublisher });
      setPublishers((prev) => [...prev, response.data]);
      setNewPublisher("");
      toast.success("Editora adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar editora.");
    }
  };

  const handleSaveBook = async () => {
    if (selectedBook) {
      const bookPayload = {
        title: selectedBook.title,
        isbn: selectedBook.isbn || "", // Adicione campo de ISBN na modal se necessário
        yearPublished: selectedBook.year,
        quantityAvailable: selectedBook.quantity,
        publisherId: selectedBook.publisherId,
        authorIds: selectedBook.authorIds || [],
      };
  
      try {
        if (isEditing) {
          // Atualiza o livro localmente (pode ajustar se houver um endpoint de update)
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book.id === selectedBook.id ? selectedBook : book))
          );
          toast.success("Livro atualizado com sucesso!");
        } else {
          // Criação de novo livro via API
          await api.createBook(bookPayload);
          toast.success("Livro adicionado com sucesso!");
  
          // Atualizar a lista de livros após adicionar
          fetchBooks();
        }
        handleCloseModal();
      } catch (error) {
        toast.error("Erro ao salvar o livro.");
        console.error("Erro ao salvar o livro:", error);
      }
    }
  };
  

  const columns = [
    {
      name: "ID",
      selector: (row: Book) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Título",
      selector: (row: Book) => row.title,
      sortable: true,
    },
    {
      name: "Autor",
      selector: (row: Book) => row.authors,
      sortable: true,
    },
    {
      name: "Editora",
      selector: (row: Book) => row.publisher,
      sortable: true,
    },
    {
      name: "Ano",
      selector: (row: Book) => row.year,
      sortable: true,
    },
    {
      name: "Disponibilidade",
      selector: (row: Book) => (row.quantity > 0 ? "Disponível" : "Indisponível"),
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row: Book) => (
        <div className="d-flex gap-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
            <Button variant="warning" size="sm" onClick={() => handleShowModal(row)}>
              <BsPencilFill size={16} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Excluir</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => handleDeleteBook(row.id)}>
              <BsTrashFill size={16} />
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>📚 Gerenciamento de Livros</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          <BsPlusLg /> Adicionar Livro
        </Button>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          title="Lista de Livros"
          columns={columns}
          data={books}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Modal para Adicionar/Editar Livros */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "✏️ Editar Livro" : "📚 Adicionar Novo Livro"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título do livro"
                value={selectedBook?.title || ""}
                onChange={(e) =>
                  setSelectedBook((prev) => ({
                    ...(prev || {
                      id: 0,
                      title: "",
                      isbn: "",
                      year: 0,
                      quantity: 0,
                      publisher: "",
                      publisherId: 0,
                      authors: "",
                      authorIds: [],
                    }),
                    title: e.target.value,
                  }))
                }
              />
            </Form.Group>

            {/* ComboBox de Autores */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Autor</Form.Label>
              <InputGroup>
                <Form.Select
                  value={selectedBook?.authorIds?.[0] || ""}
                  onChange={(e) =>
                    setSelectedBook((prev) =>
                      prev ? { ...prev, authorIds: [parseInt(e.target.value)] } : null
                    )
                  }
                >
                  <option value="">Selecione um autor</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={handleCreateAuthor}>
                  <BsPlusLg /> Adicionar Autor
                </Button>
              </InputGroup>
              <Form.Control
                type="text"
                placeholder="Novo autor"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="mt-2"
              />
            </Form.Group>

            {/* ComboBox de Editoras */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Editora</Form.Label>
              <InputGroup>
                <Form.Select
                  value={selectedBook?.publisherId || ""}
                  onChange={(e) =>
                    setSelectedBook((prev) =>
                      prev ? { ...prev, publisherId: parseInt(e.target.value) } : null
                    )
                  }
                >
                  <option value="">Selecione uma editora</option>
                  {publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.id}>
                      {publisher.name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={handleCreatePublisher}>
                  <BsPlusLg /> Adicionar Editora
                </Button>
              </InputGroup>
              <Form.Control
                type="text"
                placeholder="Nova editora"
                value={newPublisher}
                onChange={(e) => setNewPublisher(e.target.value)}
                className="mt-2"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o ISBN do livro"
                value={selectedBook?.isbn || ""}
                onChange={(e) =>
                  setSelectedBook((prev) =>
                    prev ? { ...prev, isbn: e.target.value } : null
                  )
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ano de Publicação</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o ano de publicação"
                value={selectedBook?.year || ""}
                onChange={(e) =>
                  setSelectedBook((prev) =>
                    prev ? { ...prev, year: parseInt(e.target.value) } : null
                  )
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite a quantidade disponível"
                value={selectedBook?.quantity || 0}
                onChange={(e) =>
                  setSelectedBook((prev) =>
                    prev ? { ...prev, quantity: parseInt(e.target.value) } : null
                  )
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveBook}>
            {isEditing ? "Salvar Alterações" : "Adicionar Livro"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
