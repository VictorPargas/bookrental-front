import { Loan } from "@/app/types/Loan";

export const loans: Loan[] = [
  { id: 1, bookId: 1, borrower: "Carlos Silva", borrowDate: "2025-02-01", returnDate: "2025-02-15", status: "Pendente" },
  { id: 2, bookId: 2, borrower: "Ana Souza", borrowDate: "2025-01-25", returnDate: "2025-02-05", status: "Devolvido" },
  { id: 3, bookId: 1, borrower: "Mariana Costa", borrowDate: "2025-01-10", returnDate: "2025-01-20", status: "Devolvido" },
  { id: 4, bookId: 3, borrower: "Carlos Silva", borrowDate: "2025-02-03", returnDate: "2025-02-13", status: "Pendente" },
];
