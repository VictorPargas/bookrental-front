"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsArrowRepeat, BsBoxArrowLeft } from "react-icons/bs";
import { SkeletonTable } from "@/app/components/SkeletonTable";
import { toast, ToastContainer } from "react-toastify";
import api from "../utils/xhr";
import "react-toastify/dist/ReactToastify.css";
import { Rental } from "../types/Rental";

interface User {
  id: number;
  name: string;
  email?: string;
}

interface Book {
  id: number;
  title: string;
}


export default function RentalsManagement() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [rentalsResponse, usersResponse, booksResponse] = await Promise.all([
        api.getAllRentals(),
        api.getAllUsers(),
        api.getAllBooks(),
      ]);

      setRentals(rentalsResponse.data);
      console.log("rentals", rentalsResponse.data);
      setUsers(usersResponse.data);
      console.log(usersResponse.data);
      setBooks(booksResponse.data);
      console.log("livros",booksResponse.data);
    } catch  {
      toast.error("Erro ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewRental = async (rentalId: number) => {
    try {
      await api.renewRental(rentalId, {});
      toast.success("Locação renovada com sucesso!");
      fetchAllData();
    } catch {
      toast.error("Erro ao renovar a locação.");
    }
  };

  const handleReturnRental = async (rentalId: number) => {
    try {
      await api.returnRental(rentalId);
      toast.success("Livro devolvido com sucesso!");
      fetchAllData();
    } catch {
      toast.error("Erro ao devolver o livro.");
    }
  };

  // Mapeia os nomes dos usuários e títulos dos livros para cada locação
  const enrichedRentals = rentals.map((rental) => {
    const user = users.find((u) => u.name === rental.userName);
    const book = books.find((b) => b.id === rental.bookId);

    return {
      ...rental,
      userName: user ? user.name : "Usuário não encontrado",
      bookTitle: book?.title || "Livro não encontrado",
    };
  });


  const filteredRentals = enrichedRentals.filter(
    (rental) =>
      rental.userName.toLowerCase().includes(search.toLowerCase()) ||
      rental.bookTitle.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row: Rental) => row.userId,
      sortable: true,
    },
    {
      name: "Usuário",
      selector: (row: Rental) => row.userName,
      sortable: true,
    },
    {
      name: "Livro",
      selector: (row: Rental) => row.bookTitle,
      sortable: true,
    },
    {
      name: "Data de Empréstimo",
      selector: (row: Rental) => new Date(row.rentalDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Data de Devolução",
      selector: (row: Rental) => new Date(row.returnDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row: Rental) => (
        <div className="d-flex gap-2">
          {row.status === "Pendente" && (
            <OverlayTrigger placement="top" overlay={<Tooltip>Renovar Locação</Tooltip>}>
              <Button variant="info" size="sm" onClick={() => handleRenewRental(row.rentalId)}>
                <BsArrowRepeat size={16} />
              </Button>
            </OverlayTrigger>
          )}
          <OverlayTrigger placement="top" overlay={<Tooltip>Devolver Livro</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => handleReturnRental(row.rentalId)}>
              <BsBoxArrowLeft size={16} />
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>📖 Gerenciamento de Locações</h2>
      </div>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por usuário ou livro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          title="Lista de Locações"
          columns={columns}
          data={filteredRentals}
          pagination
          highlightOnHover
          striped
        />
      )}
    </div>
  );
}
