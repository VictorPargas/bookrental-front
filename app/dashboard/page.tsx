"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsEyeFill, BsTrashFill, BsDownload } from "react-icons/bs";
import { SkeletonTable } from "@/app/components/SkeletonTable";
import { loans as mockLoans } from "@/app/data/loan";
import { books } from "@/app/data/book";
import { Loan } from "@/app/types/Loan";
import LoanStatus from "../loan/components/LoanStatus";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

export default function LoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoans(mockLoans);
      setIsLoading(false);
    }, 2000);
  }, []);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
      books.find((b) => b.id === loan.bookId)?.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  const handleDeleteLoan = (id: number) => {
    setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
  };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [['ID', 'Livro', 'Locatário', 'Data de Retirada', 'Data de Devolução', 'Status']],
//       body: filteredLoans.map(loan => [
//         loan.id,
//         books.find(b => b.id === loan.bookId)?.title || "Desconhecido",
//         loan.borrower,
//         loan.borrowDate,
//         loan.returnDate,
//         loan.status,
//       ]),
//     });
//     doc.save('relatorio_emprestimos.pdf');
//   };

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
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar empréstimos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-primary" onClick={() => alert("teste")}>
          <BsDownload className="me-2" />Exportar PDF
        </Button>
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📖 Detalhes do Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <div className="p-3">
              <h5 className="text-primary">
                📚 {books.find((b) => b.id === selectedLoan.bookId)?.title}
              </h5>
              <p className="text-muted">Locatário: <strong>{selectedLoan.borrower}</strong></p>

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
                    <td><strong>Status</strong></td>
                    <td><LoanStatus status={selectedLoan.status} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
