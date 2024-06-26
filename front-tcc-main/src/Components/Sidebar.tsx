import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  DesktopOutlined,
  ControlOutlined,
  PlayCircleOutlined,
  UserOutlined,
  TeamOutlined,
  PlusCircleOutlined,
  EyeFilled, // Importe o ícone PlusCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import '../Styles/app.css';
import { PlaceholderButton } from 'react-bootstrap';
const { SubMenu } = Menu;
const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sider
      width={200}
      theme="dark"
      collapsible
      collapsed={isCollapsed}
      onCollapse={toggleSidebar}
      className="sidebar"
    >
      <Menu theme="dark" mode="vertical">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <SubMenu key="cadastro" icon={<TeamOutlined />} title="Cadastro">
          <Menu.Item key="desktop" icon={<DesktopOutlined />}>
            <Link to="/monitor">Monitores</Link>
          </Menu.Item>
          <Menu.Item key="patient" icon={<UserOutlined />}>
            <Link to="/paciente">Pacientes</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="admin" icon={<ControlOutlined />}>
          <Link to="/adm">Painel do Administrador</Link>
        </Menu.Item>
        <Menu.Item key="session" icon={<EyeFilled />}>
        <Link to="/exibir-sessao">Exibir Sessão</Link>
        </Menu.Item>
        {/* Elemento "Criar Exercício" com ícone */}
        <Menu.Item key="create-exercise" icon={<PlusCircleOutlined />}>
          <Link to="/criar-exercicio">Criar Exercício</Link>
        </Menu.Item>
        <Menu.Item key="create-session" icon={<PlusCircleOutlined />}>
          <Link to="/criar-sessao">Criar Sessão</Link>
        </Menu.Item>
        <Menu.Item key="relatorio" icon={<PlusCircleOutlined />}>
          <Link to="/relatorio">Relatorio</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
