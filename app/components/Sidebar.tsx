"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiBook, BiChevronLeft, BiChevronRight, BiHome, BiSolidDashboard, BiUser } from "react-icons/bi";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { ChangePasswordParams, UpdateUserParams, UserProfile } from "../types/user";
import api from "../utils/xhr";
import { Dropdown, Modal, Tabs, Tab, Form, Button, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BsPinAngle } from "react-icons/bs";

export default function Sidebar({ isOpen, onClose, isMobile }: { isOpen: boolean, onClose: () => void, isMobile: boolean }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<UpdateUserParams>({ name: "", profile: "", email: "" });
  const [passwordData, setPasswordData] = useState<ChangePasswordParams>({ password: "", newPassword: "" });
  const [errors] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.getUserProfile();
      setUserProfile(response.data);
      setFormData({ ...response.data });
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.updateUser<UpdateUserParams>(formData);
      toast.success("Perfil atualizado com sucesso!");
      setShowModal(false);
      fetchUserProfile();  // Atualiza o perfil após sucesso
    } catch {
      toast.error("Erro ao atualizar o perfil!");
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.changePassword<ChangePasswordParams>(passwordData);
      toast.success("Senha alterada com sucesso!");
      setShowModal(false);
    } catch {
      toast.error("Erro ao alterar a senha!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");  // Remove o token do localStorage
    router.push("/auth");  // Redireciona para a página de login
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
    <div 
        className={`d-flex flex-column flex-shrink-0 text-white bg-dark shadow-sm 
          ${isMobile ? (isOpen ? 'sidebar-open' : 'sidebar-closed') : (isCollapsed ? 'collapsed-sidebar' : 'expanded-sidebar')}
        `}
        style={{
          width: isMobile ? '250px' : (isCollapsed ? '80px' : '280px'),
          height: '100vh',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: isMobile ? (isOpen ? '0' : '-250px') : '0',
          transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out',
          zIndex: 1000,
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {!isMobile && (
            <div onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                position: 'fixed',
                top: '17px',
                left: isCollapsed ? '80px' : '280px',
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#000',
                zIndex: 1100,
                cursor: 'pointer'
                }}
            >
                {isCollapsed ? <BiChevronRight size={30} /> : <BiChevronLeft size={30} />}
            </div>
            )}

        <hr className="my-2 mx-3" />

        <nav className="nav nav-pills flex-column gap-2 my-4">
            <SidebarItem 
                href="/" 
                icon={<BiHome className="me-3" size={20} />} 
                text="Home" 
                isCollapsed={isCollapsed} 
                pathname={pathname} 
            />

            {userProfile?.profile === "Administrador" && (
                <>
                    <SidebarItem 
                        href="/reports" 
                        icon={<BiSolidDashboard size={22} />} 
                        text="Dashboard" 
                        isCollapsed={isCollapsed} 
                        pathname={pathname} 
                    />
                    <SidebarItem 
                        href="/manager" 
                        icon={<BsPinAngle size={22} />} 
                        text="Gerenciamento" 
                        isCollapsed={isCollapsed} 
                        pathname={pathname} 
                    />
                    <SidebarItem 
                        href="/user" 
                        icon={<BiUser size={22} />} 
                        text="Usuarios" 
                        isCollapsed={isCollapsed} 
                        pathname={pathname} 
                    />
                    <SidebarItem 
                        href="/rentals" 
                        icon={<BiBook size={22} />} 
                        text="Locações" 
                        isCollapsed={isCollapsed} 
                        pathname={pathname} 
                    />
                </>
            )}
            <SidebarItem 
                href="/rentals/my" 
                icon={<BiBook size={22} />} 
                text="Meus Aluguéis" 
                isCollapsed={isCollapsed} 
                pathname={pathname} 
            />
        </nav>

        <ul className="nav flex-column mt-auto gap-2">
            <Dropdown style={{ position: 'relative' }}>
                <Dropdown.Toggle 
                    variant="link" 
                    className="d-flex align-items-center text-decoration-none text-white"
                    id="dropdown-user"
                >
                <Image
                    src={"/assets/user.png"}
                    alt={userProfile?.name || "Usuário"}
                    width={32}
                    height={32}
                    className="rounded-circle me-2"
                />
                {!isCollapsed && <strong>{userProfile?.name || "Usuário"}</strong>}
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow">
                <Dropdown.Item onClick={() => setShowModal(true)}>
                    <IoSettingsOutline size={20} className="me-2" />
                    Configurações
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                    Sair
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </ul>

        {/* Modal de Configurações */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Configurações da Conta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {Array.isArray(errors) && errors.length > 0 && (<Alert variant="danger">{errors.join(", ")}</Alert>)}
                <Tabs defaultActiveKey="profile" id="settings-tabs" className="mb-3">
                    <Tab eventKey="profile" title="Perfil">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleProfileUpdate}>Salvar</Button>
                        </Form>
                    </Tab>
                    <Tab eventKey="password" title="Alterar Senha">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Senha Atual</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={passwordData.password} 
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova Senha</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={passwordData.newPassword} 
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleChangePassword}>Alterar Senha</Button>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    </div>
    </>
  );
}

function SidebarItem({ href, icon, text, isCollapsed, pathname }: { href: string; icon: JSX.Element; text: string; isCollapsed: boolean; pathname: string }) {
    return (
      <Link 
        href={href} 
        className={`nav-link d-flex align-items-center py-2 ${pathname === href ? "active bg-secondary" : "text-light"}`}>
        {icon}
        {!isCollapsed && <span className="ms-2">{text}</span>}
      </Link>
    );
  } 