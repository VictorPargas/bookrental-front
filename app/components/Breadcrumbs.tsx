"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "react-bootstrap";

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Se o pathname for undefined, não renderiza nada
  if (!pathname) return null;

  // Divide a URL em partes, removendo strings vazias
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Mapeia nomes amigáveis para os breadcrumbs
  const breadcrumbNames: { [key: string]: string } = {
    loans: "Empréstimos",
    add: "Nova Locação",
    return: "Devolução de Livros",
    reports: "Dashboard",
    books: "Livros Mais Locados",
    users: "Usuários com Mais Empréstimos",
    dashboard: "Status das Locações",
  };

  return (
    <Row>
        <Col xs={12}>
            <div className="page-title-box d-flex align-items-center justify-content-between">
                <Breadcrumb  className="m-0">
                    {/* Primeiro item sempre leva para Home */}
                    <BreadcrumbItem>
                        <Link href="/">Home</Link>
                    </BreadcrumbItem>

                    {pathSegments.map((segment, index) => {
                        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathSegments.length - 1;
                        const label = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                        return (
                        <BreadcrumbItem key={href} active={isLast}>
                            {!isLast ? <Link href={href}>{label}</Link> : label}
                        </BreadcrumbItem>
                        );
                    })}
                </Breadcrumb>     
            </div>
           
        </Col>
        
    </Row>
   
  );
}
