export interface Rental {
    id: number;
    userId: string;
    userName: string;
    bookId: number;
    bookTitle: string;
    rentalDate: string;
    returnDate: string;
    renewed: boolean;
  }