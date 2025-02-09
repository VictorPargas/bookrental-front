"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsEyeFill, BsTrashFill } from "react-icons/bs";
import { SkeletonTable } from "@/app/components/SkeletonTable";
import { loans as mockLoans } from "@/app/data/loan";
import { books } from "@/app/data/book";
import { Loan } from "@/app/types/Loan";
import LoanStatus from "./components/LoanStatus";

export default function LoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoans(mockLoans); // Simula carregamento de dados
      setIsLoading(false);
    }, 2000); // Simula um delay de 2 segundos
  }, []);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
      books.find((b) => b.id === loan.bookId)?.title.toLowerCase().includes(search.toLowerCase())
  );

  // Função para abrir o modal com os detalhes do empréstimo
  const handleShowModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  const handleDeleteLoan = (id: number) => {
    setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
  };

  // Definição das colunas do DataTable
  const columns = [
    {
      name: "ID",
      selector: (row: Loan) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Livro",
      selector: (row: Loan) => books.find((b) => b.id === row.bookId)?.title || "Desconhecido",
      sortable: true,
    },
    {
      name: "Locatário",
      selector: (row: Loan) => row.borrower,
      sortable: true,
    },
    {
      name: "Data de Retirada",
      selector: (row: Loan) => row.borrowDate,
      sortable: true,
    },
    {
      name: "Data de Devolução",
      selector: (row: Loan) => row.returnDate,
      sortable: true,
    },
    {
      name: "Multa",
      selector: (row: Loan) => (row.fine ? `£${row.fine.toFixed(2)}` : "Sem multa"),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: Loan) => <LoanStatus status={row.status} />,
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row: Loan) => (
        <div className="d-flex gap-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Ver Detalhes</Tooltip>}>
            <Button variant="primary" size="sm" onClick={() => handleShowModal(row)}>
              <BsEyeFill size={16} />
            </Button>
          </OverlayTrigger>
  
          <OverlayTrigger placement="top" overlay={<Tooltip>Excluir</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => handleDeleteLoan(row.id)}>
              <BsTrashFill size={16} />
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3 align-items-center mb-3">
        <button className="btn btn-success" onClick={() => router.push("/loan/return")}>
          Registrar Devolução
        </button>
      </div>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar empréstimos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          title="Lista de Empréstimos"
          columns={columns}
          data={filteredLoans}
          pagination
          highlightOnHover
          striped
        />
      )}

      {/* Modal para Exibir os Detalhes do Empréstimo */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📖 Detalhes do Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <div className="p-3">
              {/* Cabeçalho do Modal */}
              <h5 className="text-primary">
                📚 {books.find((b) => b.id === selectedLoan.bookId)?.title}
              </h5>
              <p className="text-muted">Locatário: <strong>{selectedLoan.borrower}</strong></p>

              {/* Tabela com detalhes */}
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>ID</strong></td>
                    <td>{selectedLoan.id}</td>
                  </tr>
                  <tr>
                    <td><strong>Data de Retirada</strong></td>
                    <td>{selectedLoan.borrowDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Data de Devolução</strong></td>
                    <td>{selectedLoan.returnDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Data Real de Devolução</strong></td>
                    <td>{selectedLoan.actualReturnDate || <span className="text-warning">Ainda não devolvido</span>}</td>
                  </tr>
                  <tr>
                    <td><strong>Multa</strong></td>
                    <td>
                      {selectedLoan.fine ? (
                        <span className="text-danger fw-bold">£{selectedLoan.fine.toFixed(2)}</span>
                      ) : (
                        <span className="text-success">Sem multa</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td><LoanStatus status={selectedLoan.status} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        {/* Se o empréstimo ainda estiver pendente, mostrar botão de devolução */}
        {selectedLoan?.status === "Pendente" && (
          <Button variant="success">
            📦 Marcar como Devolvido
          </Button>
        )}
        <Button variant="secondary" onClick={handleCloseModal}>
          Fechar
        </Button>
      </Modal.Footer>
      </Modal>

    </div>
  );
}
