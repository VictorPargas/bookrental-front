"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function NavigationBar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname(); // Captura a URL atual para corrigir o comportamento do menu

  return (
    <Navbar bg="dark" variant="dark" expand="md" expanded={expanded} className="mb-4">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Biblioteca
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              href="/loans"
              active={pathname === "/loan"}
              onClick={() => setExpanded(false)}
            >
              Empréstimos
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/loans/add"
              active={pathname === "/loan/add"}
              onClick={() => setExpanded(false)}
            >
              Nova Locação
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/loans/return"
              active={pathname === "/loan/return"}
              onClick={() => setExpanded(false)}
            >
              Devolução de Livros
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
