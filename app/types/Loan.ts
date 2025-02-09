export interface Loan {
    id: number;
    bookId: number;
    borrower: string;
    borrowDate: string;
    returnDate: string;
    actualReturnDate?: string;
    fine?: number;
    status: "Pendente" | "Devolvido";
  }
  