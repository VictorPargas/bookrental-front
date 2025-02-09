"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsPencilFill, BsPlusLg } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import api from "../utils/xhr";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTable } from "../components/SkeletonTable";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar os usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsEditing(!!user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        if (isEditing) {
          await api.updateUser({ id: selectedUser.id, name: selectedUser.name, email: selectedUser.email });
          toast.success("Usuário atualizado com sucesso!");
        } else {
          await api.registerUser({ name: selectedUser.name, email: selectedUser.email });
          toast.success("Usuário adicionado com sucesso!");
        }
        fetchUsers();
        handleCloseModal();
      } catch (error) {
        toast.error("Erro ao salvar o usuário.");
      }
    }
  };

//   const handleDeleteUser = async (id: string) => {
//     try {
//       await api.deleteUser(id);
//       toast.success("Usuário excluído com sucesso!");
//       fetchUsers();
//     } catch (error) {
//       toast.error("Erro ao excluir o usuário.");
//     }
//   };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "ID",
      selector: (row: User) => row.id,
      sortable: true,
    },
    {
      name: "Nome",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: User) => row.email,
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row: User) => (
        <div className="d-flex gap-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
            <Button variant="warning" size="sm" onClick={() => handleShowModal(row)}>
              <BsPencilFill size={16} />
            </Button>
          </OverlayTrigger>

          {/* <OverlayTrigger placement="top" overlay={<Tooltip>Excluir</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(row.id)}>
              <BsTrashFill size={16} />
            </Button>
          </OverlayTrigger> */}
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>👥 Gerenciamento de Usuários</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          <BsPlusLg /> Adicionar Usuário
        </Button>
      </div>

      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar usuários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          title="Lista de Usuários"
          columns={columns}
          data={filteredUsers}
          pagination
          highlightOnHover
          striped
        />
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "✏️ Editar Usuário" : "👥 Adicionar Novo Usuário"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do usuário"
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : { id: '', name: e.target.value, email: '' }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o email do usuário"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : { id: '', name: '', email: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {isEditing ? "Salvar Alterações" : "Adicionar Usuário"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
