import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importe o Router e o Routes
import './App.css';
import Monitor from './Components/Monitor/Monitor';
import Paciente from './Components/Paciente/Paciente'
import Administrador from './Components/Administrador/Administrador';
import Perfil from './Components/Perfil/Perfil';
import Iniciar from './Components/Iniciar';
import CriarExercicio from './Components/CriarExercicio/CriarExercicio';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router> {/* Inclua o Router para envolver todo o aplicativo */}
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} />
        <Layout className="site-layout">
          <Content style={{ margin: '16px' }}>
            <Routes> {/* Use Routes para configurar as rotas */}
              <Route path="/" element={<div className={`App ${collapsed ? 'collapsed' : ''}`}>
                {/* Conteúdo principal do seu site aqui */}
                <h1>Página Principal</h1>
                <button onClick={toggleSidebar}>Toggle Sidebar</button>
              </div>} />
              <Route path="/animation" element={<Iniciar />} /> {/* Rota para a página de animação */}
              <Route path="/monitor" element={<Monitor />} /> {/* Rota para a página de animação */}
              <Route path="/paciente" element={<Paciente />} /> {/* Rota para a página de animação */}
              <Route path="/adm" element={<Administrador />} /> {/* Rota para a página de animação */}
              <Route path="/perfil/:pacienteId" element={<Perfil />} />
              <Route path="/criar-exercicio" element={<CriarExercicio />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
