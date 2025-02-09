"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";
import dynamic from "next/dynamic";
import { BookOpen, Users, BarChart } from "lucide-react";
import StatsCard from "./components/StatsCard";
import { books } from "@/app/data/book";
import { loans } from "@/app/data/loan";
import ReactApexChart from "react-apexcharts";

// Importação dinâmica do ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ReportsPage() {
  const [summary, setSummary] = useState({ totalLoans: 0, totalUsers: 0, totalBooks: 0 });

  useEffect(() => {
    const totalLoans = loans.length;
    const totalUsers = new Set(loans.map((loan) => loan.borrower)).size;
    const totalBooks = books.length;

    setSummary({ totalLoans, totalUsers, totalBooks });
  }, []);

  return (
    <Card>
        <CardBody>
            <div className="float-end">
            <select className="form-select form-select-sm">
                                <option defaultValue>Outubro</option>
                                <option value="1">Setembro</option>
                                <option value="2">Agosto</option>
                                <option value="3">Julho</option>
             </select>
            </div>
            <h4 className="card-title mb-4">Produtos em Destaque</h4>

            <div id="donut-chart" className="apex-charts">
                           
             </div>
        </CardBody>
    </Card>
  );
}
