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


export default function RentalsManagement() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.getAllRentals();
      setRentals(response.data);
    } catch (error) {
      toast.error("Erro ao carregar as locações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewRental = async (rentalId: number) => {
    try {
      await api.renewRental(rentalId, {});
      toast.success("Locação renovada com sucesso!");
      fetchRentals();
    } catch (error) {
      toast.error("Erro ao renovar a locação.");
    }
  };

  const handleReturnRental = async (rentalId: number) => {
    try {
      await api.returnRental(rentalId);
      toast.success("Livro devolvido com sucesso!");
      fetchRentals();
    } catch (error) {
      toast.error("Erro ao devolver o livro.");
    }
  };

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.userName.toLowerCase().includes(search.toLowerCase()) ||
      rental.bookTitle.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row: Rental) => row.id,
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
          {!row.renewed && (
            <OverlayTrigger placement="top" overlay={<Tooltip>Renovar Locação</Tooltip>}>
              <Button variant="info" size="sm" onClick={() => handleRenewRental(row.id)}>
                <BsArrowRepeat size={16} />
              </Button>
            </OverlayTrigger>
          )}
          <OverlayTrigger placement="top" overlay={<Tooltip>Devolver Livro</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => handleReturnRental(row.id)}>
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
