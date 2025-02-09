export interface Book {
  id: number;
  title: string;
  isbn: string;
  year: number;  // Ano de publicação
  quantity: number;  // Quantidade disponível
  publisher: string;  // Nome da editora
  authors: string;  // Nome(s) do(s) autor(es), convertido de array para string
  image?: string;  // URL da imagem do livro (opcional)
  publisherId?: number;
  authorIds?: number[];
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

// Tipo para a resposta da requisição Axios
export interface AxiosBookResponse {
  data: BookApiResponse[];
} 