"use client";

import { useState, useEffect } from "react";
import { books } from "@/app/data/book";
import { loans } from "@/app/data/loan";
import { Card, Table } from "react-bootstrap";
import dynamic from "next/dynamic";
import { Award, BookOpen } from "lucide-react";

// Importação dinâmica do gráfico para evitar problemas no Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BooksReport() {
  const [chartData, setChartData] = useState<any>(null);
  const [sortedBooks, setSortedBooks] = useState<any[]>([]);

  useEffect(() => {
    const bookStats = books.map((book) => ({
      ...book,
      totalLoans: loans.filter((loan) => loan.bookId === book.id).length,
    }));

    const sorted = bookStats.sort((a, b) => b.totalLoans - a.totalLoans);
    setSortedBooks(sorted);

    setChartData({
      series: [
        {
          name: "Locações",
          data: sorted.slice(0, 5).map((book) => book.totalLoans),
        },
      ],
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
          categories: sorted.slice(0, 5).map((book) => book.title),
        },
        colors: ["#3498db"],
        plotOptions: {
          bar: {
            borderRadius: 5,
            columnWidth: "50%",
          },
        },
      },
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">📊 Relatório de Livros Mais Locados</h2>

      {/* Gráfico de Barras */}
      <Card className="p-4 shadow-sm mb-4">
        <h5 className="fw-bold text-primary d-flex align-items-center">
          <Award className="me-2" /> Top 5 Livros Mais Locados
        </h5>
        {chartData ? <Chart options={chartData.options} series={chartData.series} type="bar" height={300} /> : <p>Carregando gráfico...</p>}
      </Card>

      {/* Livro mais locado */}
      {sortedBooks.length > 0 && (
        <Card className="p-4 shadow-sm mb-4 border-0 text-center bg-light">
          <h4 className="text-success fw-bold">📖 Livro Mais Locado</h4>
          <h2 className="fw-bold">{sortedBooks[0].title}</h2>
          <p className="text-muted">{sortedBooks[0].author}</p>
          <p className="text-muted">ISBN: {sortedBooks[0].isbn}</p>
          <h5 className="fw-bold text-dark">
            Total de Locações: <span className="text-success">{sortedBooks[0].totalLoans}</span>
          </h5>
        </Card>
      )}

      {/* Tabela estilizada */}
      <Card className="p-4 shadow-sm border-0">
        <h5 className="fw-bold text-primary d-flex align-items-center">
          <BookOpen className="me-2" /> Detalhes das Locações
        </h5>
        <Table striped hover responsive>
          <thead className="table-light">
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th className="text-center">Qtd. Locado</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td className="text-center">
                  <span className="badge bg-success px-3 py-2">{book.totalLoans}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
