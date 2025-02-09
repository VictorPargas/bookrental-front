"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { books } from "@/app/data/book";
import { loans } from "@/app/data/loan";
import { Loan } from "@/app/types/Loan";

export default function AddLoan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookIdFromQuery = searchParams.get("bookId");

  const [borrower, setBorrower] = useState("");
  const [bookId, setBookId] = useState<number | null>(bookIdFromQuery ? Number(bookIdFromQuery) : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookIdFromQuery) {
      setBookId(Number(bookIdFromQuery));
    }
  }, [bookIdFromQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId) {
      setError("Selecione um livro");
      return;
    }

    const selectedBook = books.find((book) => book.id === bookId);
    if (!selectedBook || selectedBook.quantity < 1) {
      setError("Livro indisponível para locação.");
      return;
    }

    const newLoan: Loan = {
      id: loans.length + 1,
      bookId,
      borrower,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0],
      status: "Pendente",
    };

    loans.push(newLoan);
    selectedBook.quantity -= 1;

    router.push("/loan");
  };

  return (
    <div>
      <h1 className="text-primary">Registrar Locação</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Locatário</label>
          <input
            type="text"
            className="form-control"
            required
            value={borrower}
            onChange={(e) => setBorrower(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Registrar Locação</button>
      </form>
    </div>
  );
}
