"use client";

import { users } from "@/app/data/user";
import { loans } from "@/app/data/loan";

export default function UsersReport() {
  // Contabiliza os empréstimos por usuário
  const userStats = users.map((user) => ({
    ...user,
    totalLoans: loans.filter((loan) => loan.borrower === user.name).length,
  }));

  // Ordena pelo usuário com mais empréstimos
  const sortedUsers = userStats.sort((a, b) => b.totalLoans - a.totalLoans);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Usuários com Mais Empréstimos</h1>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Total Empréstimos</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.totalLoans}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
