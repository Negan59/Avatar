import React, { useState, useEffect } from 'react';
import { Button, Layout, Typography, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MonitorModal from './ModalMonitor';
import TabelaMonitor from './TabelaMonitor';

const { Header, Content } = Layout;
const { Title } = Typography;

interface MonitorData {
  id: number;
  nome: string;
  email: string;
  ra: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
}

interface MonitorDataS {
  id: number;
  nome: string;
  email: string;
  ra: string;
  cpf: string;
}

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<MonitorDataS | null>(null);
  const [monitores, setMonitores] = useState<MonitorData[]>([]);
  const [modalKey, setModalKey] = useState(0);
  const [erroMessage, setErroMessage] = useState<string | null>(null);
  const [sucessoMessage, setSucessoMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  // Remova as chaves "senha" e "confirmarSenha" dos objetos em dataSource
  const dataSourceSemSenha = monitores.map(({ senha, confirmarSenha, ...rest }) => rest);

  // Carrega os monitores da API ao montar o componente
  useEffect(() => {
    buscar();
  }, []);

  const buscar = () => {
    setSucessoMessage(null); // Definir mensagem de sucesso
    setErroMessage(null); // Limpar mensagem de erro
    fetch('http://localhost:8080/api/monitor')
      .then((response) => response.json())
      .then((data) => {
        setMonitores(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar monitores:', error);
        setErroMessage('Erro ao carregar monitores.'); // Definir mensagem de erro
      });
  };

  const handleEditar = (record: MonitorDataS) => {
    setSucessoMessage(null); // Definir mensagem de sucesso
    setErroMessage(null); // Limpar mensagem de erro
    setEditingMonitor(record);
    setModalVisible(true);
  };

  const handleExcluir = (record: Number) => {
    const idMonitor = record;
    fetch(`http://localhost:8080/api/monitor/${idMonitor}`, {
      method: 'DELETE',
    })
      .then((response) => {
        // Remove o monitor da lista localmente após a exclusão
        const updatedMonitores = monitores.filter((monitor) => monitor.id !== idMonitor);
        setMonitores(updatedMonitores);
        buscar();
        setSucessoMessage('Monitor excluído com sucesso.'); // Definir mensagem de sucesso
      })
      .catch((error) => {
        console.error('Erro ao excluir monitor:', error);
        setErroMessage('Erro ao excluir monitor.'); // Definir mensagem de erro
      });
  };

  const handleCadastroSubmit = (values: MonitorData) => {
    if (editingMonitor) {
      values.id = editingMonitor.id;
      fetch(`http://localhost:8080/api/monitor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedMonitores = monitores.map((monitor) =>
            monitor.id === values.id ? { ...monitor, ...data } : monitor
          );
          setMonitores(updatedMonitores);
          buscar();
          setSucessoMessage('Monitor atualizado com sucesso'); // Definir mensagem de sucesso
        })
        .catch((error) => {
          console.error('Erro ao atualizar monitor:', error);
          setErroMessage('Erro ao atualizar monitor'); // Definir mensagem de erro
        });
    } else {
      fetch('http://localhost:8080/api/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          setMonitores([...monitores, data]);
          buscar();
          setSucessoMessage('Monitor inserido com sucesso'); // Definir mensagem de sucesso
        })
        .catch((error) => {
          console.error('Erro ao inserir monitor:', error);
          setErroMessage('Erro ao inserir monitor'); // Definir mensagem de erro
        });
    }
    setModalVisible(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    buscarPorNome();
  };

  const buscarPorNome = () => {
    setSucessoMessage(null);
    setErroMessage(null);
    fetch(`http://localhost:8080/api/monitornome?nome=${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        setMonitores(data);
      })
      .catch((error) => {
        console.error('Erro ao pesquisar monitores:', error);
        setErroMessage('Erro ao pesquisar monitores.');
      });
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: 'transparent', color: 'white', textAlign: 'center', padding: '16px 0' }}>
        <Title level={2}>Lista de Monitores</Title>
        <Space style={{ float: 'right' }}>
          <Input
            placeholder="Pesquisar por nome"
            value={searchValue}
            onChange={handleSearchChange}
            style={{ width: '200px' }}
            onPressEnter={handleSearch}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                style={{ cursor: 'pointer', color: '#1890ff' }}
              />
            }
          />
          <Button type="primary" onClick={handleSearch}>
            Pesquisar
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px', paddingTop: '64px' }}>
        {erroMessage && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            {erroMessage}
          </div>
        )}
        {sucessoMessage && (
          <div style={{ color: 'green', marginBottom: '16px' }}>
            {sucessoMessage}
          </div>
        )}
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          style={{ marginBottom: '16px' }}
        >
          Cadastrar Monitor
        </Button>
        <MonitorModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingMonitor(null);
            setModalKey(modalKey + 1);
          }}
          onSubmit={handleCadastroSubmit}
          monitorToEdit={editingMonitor}
        />
        <TabelaMonitor dataSource={dataSourceSemSenha} onEditar={handleEditar} onExcluir={handleExcluir} />
      </Content>
    </Layout>
  );
}

export default App;
