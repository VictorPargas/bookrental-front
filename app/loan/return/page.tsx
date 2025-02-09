"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loans } from "@/app/data/loan";
import { books } from "@/app/data/book";
import { Loan } from "@/app/types/Loan";

export default function ReturnLoan() {
  const router = useRouter();
  const [loanId, setLoanId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReturn = () => {
    if (!loanId) {
      setError("Selecione um empréstimo.");
      return;
    }

    const loanIndex = loans.findIndex((loan) => loan.id === loanId);
    if (loanIndex === -1) {
      setError("Empréstimo não encontrado.");
      return;
    }

    const loan = loans[loanIndex];

    if (loan.status === "Devolvido") {
      setError("Este livro já foi devolvido.");
      return;
    }

    // Calcular multa se houver atraso
    const today = new Date();
    const returnDate = new Date(loan.returnDate);
    const daysLate = Math.max(0, Math.ceil((today.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24)));
    const fine = daysLate > 0 ? daysLate * 1.5 : 0; // £1.5 por dia de atraso

    // Atualizar os dados do empréstimo
    loans[loanIndex] = {
      ...loan,
      actualReturnDate: today.toISOString().split("T")[0],
      fine: fine,
      status: "Devolvido",
    };

    // Repor o livro ao estoque
    const bookIndex = books.findIndex((book) => book.id === loan.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].quantity += 1;
    }

    setSuccess(`Livro devolvido com sucesso! Multa: £${fine.toFixed(2)}`);
    setError("");
    setTimeout(() => router.push("/loan"), 2000);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary">Devolução de Livro</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Selecione um Empréstimo</label>
        <select className="form-control" onChange={(e) => setLoanId(Number(e.target.value))}>
          <option value="">Escolha um empréstimo</option>
          {loans
            .filter((loan) => loan.status === "Pendente")
            .map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.borrower} - {books.find((b) => b.id === loan.bookId)?.title}
              </option>
            ))}
        </select>
      </div>

      <button className="btn btn-success" onClick={handleReturn}>Registrar Devolução</button>
    </div>
  );
}
