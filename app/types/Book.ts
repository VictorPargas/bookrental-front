export interface Book {
  id: number;
  title: string;
  isbn: string;
  year: number; 
  quantity: number;  
  publisher: string; 
  authors: string;  
  image?: string;  
  publisherId?: number;
  authorIds?: number[];
  isAvailable?: boolean;
}


export interface BookApiResponse {
  id: number;
  title: string;
  isbn: string;
  yearPublished: number;
  quantityAvailable: number;
  publisherName: string;
  authors: string[];
  publisherId?: number;
  authorIds?: number[];
  isAvailable?: boolean;
}

export interface BookFilterCriteria {
  search: string;
  category: string;
  availability: 'all' | 'available' | 'unavailable';
  year: string;
}

export interface Pagination {
  currentPage: number;
  booksPerPage: number;
}

export interface BookProps {
  books: Book[];
  filteredBooks: Book[];
  isLoading: boolean;
  selectedBook: Book | null;
  showModal: boolean;
  setSelectedBook: (book: Book | null) => void;
  setShowModal: (show: boolean) => void;
}

export interface ModalBookRentalProps {
  show: boolean;
  onHide: () => void;
  book: Book | null;
} 

export interface AxiosBookResponse {
  data: BookApiResponse[];
} 