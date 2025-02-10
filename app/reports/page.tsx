"use client";

import { useState, useEffect } from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
import dynamic from "next/dynamic";
import api from "@/app/utils/xhr";
import "bootstrap/dist/css/bootstrap.min.css";

interface Rental {
  bookId: number;
  userName: string;
}

interface Book {
  id: number;
  title: string;
}

interface ChartData {
  title: string;
  count: number;
}

interface UserChartData {
  userName: string;
  count: number;
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MostLoanedBooksDashboard() {
  const [bookData, setBookData] = useState<ChartData[]>([]);
  const [userData, setUserData] = useState<UserChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const rentalsResponse = await api.getAllRentals();
      const booksResponse = await api.getAllBooks();
      const rentals: Rental[] = rentalsResponse.data;
      const books: Book[] = booksResponse.data;


      const bookCount = rentals.reduce<Record<number, number>>((acc, rental) => {
        acc[rental.bookId] = (acc[rental.bookId] || 0) + 1;
        return acc;
      }, {});


      const userCount = rentals.reduce<Record<string, number>>((acc, rental) => {
        acc[rental.userName] = (acc[rental.userName] || 0) + 1;
        return acc;
      }, {});


      const sortedBooks = Object.entries(bookCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); 


      const sortedUsers = Object.entries(userCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); 

      const bookChartData: ChartData[] = sortedBooks.map(([bookId, count]) => {
        const book = books.find((b) => b.id === parseInt(bookId));
        return { title: book ? book.title : "Desconhecido", count };
      });

      const userChartData: UserChartData[] = sortedUsers.map(([userName, count]) => ({
        userName,
        count,
      }));

      setBookData(bookChartData);
      setUserData(userChartData);
    } catch (error) {
      console.error("Erro ao carregar os dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bookChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    xaxis: {
      categories: bookData.map((book) => book.title),
    },
    colors: ["#007bff"],
  };

  const bookChartSeries = [
    {
      name: "Quantidade de Empréstimos",
      data: bookData.map((book) => book.count),
    },
  ];

  const userChartOptions: ApexCharts.ApexOptions  = {
    chart: {
      type: "donut",
    },
    labels: userData.map((user) => user.userName),
    colors: ["#28a745", "#20c997", "#17a2b8", "#ffc107", "#dc3545"],
    legend: {
      position: "bottom",
    },
  };

  const userChartSeries = userData.map((user) => user.count);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📊 Livros Mais Alugados e Usuários com Mais Empréstimos
      </h2>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          <Col xs={12} md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">📚 Livros Mais Alugados
                </h5>
                <Chart options={bookChartOptions} series={bookChartSeries} type="bar" height={350} />
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">👤 Usuários com Mais Empréstimos
                </h5>
                <Chart options={userChartOptions} series={userChartSeries} type="donut" height={350} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
