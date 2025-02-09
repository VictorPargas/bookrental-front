import { useState } from "react";
import { books } from "@/app/data/book";
import { loans } from "@/app/data/loan";
import { Loan } from "@/app/types/Loan";
import { useRouter } from "next/router";

export default function AddLoan() {
  const router = useRouter();
  const [borrower, setBorrower] = useState("");
  const [bookId, setBookId] = useState<number | null>(null);
  const [error, setError] = useState("");

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

    // Criando novo empréstimo
    const newLoan: Loan = {
      id: loans.length + 1,
      bookId,
      borrower,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0],
      status: "Pendente",
    };

    loans.push(newLoan); // Simula um banco de dados
    selectedBook.quantity -= 1; // Atualiza a quantidade disponível

    router.push("/loan");
  };

  return (
    <div className="container mt-4">
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

        <div className="mb-3">
          <label className="form-label">Livro</label>
          <select className="form-control" required onChange={(e) => setBookId(Number(e.target.value))}>
            <option value="">Selecione um livro</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.quantity} disponíveis)
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">Registrar Locação</button>
      </form>
    </div>
  );
}
