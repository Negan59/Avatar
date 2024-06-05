import React, { useState, useEffect } from 'react';
import { Button, Layout, Typography, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PacienteModal from './ModalPaciente';
import TabelaPaciente from './TabelaPaciente';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title } = Typography;

interface PacienteData {
    id: number;
    nome: string;
    idade: number;
    datanascimento: moment.Moment | null;
    telefone: string;
    sexo: 'Masculino' | 'Feminino';
    cordapele: string;
    estadocivil: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)';
    responsavel: string;
    profissaoresponsavel: string;
    altura: number;
    peso: number;
}

function App() {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPaciente, setEditingPaciente] = useState<PacienteData | null>(null);
    const [pacientes, setPacientes] = useState<PacienteData[]>([]);
    const [erroMessage, setErroMessage] = useState<string | null>(null);
    const [sucessoMessage, setSucessoMessage] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');



    useEffect(() => {
        buscar();
    }, []);

    const buscar = () => {
        setSucessoMessage(null);
        setErroMessage(null);
        fetch('http://localhost:8080/api/paciente')
            .then((response) => response.json())
            .then((data) => {
                setPacientes(data);
            })
            .catch((error) => {
                console.error('Erro ao carregar pacientes:', error);
                setErroMessage('Erro ao carregar pacientes.');
            });
    };

    const handleEditar = (record: PacienteData) => {
        setSucessoMessage(null);
        setErroMessage(null);
        setEditingPaciente(record);
        setModalVisible(true);
    };

    const handleExcluir = (record: number) => {
        const idPaciente = record;
        fetch(`http://localhost:8080/api/paciente/${idPaciente}`, {
            method: 'DELETE',
        })
            .then(() => {
                const updatedPacientes = pacientes.filter((paciente) => paciente.id !== idPaciente);
                setPacientes(updatedPacientes);
                buscar();
                setSucessoMessage('Paciente excluído com sucesso.');
            })
            .catch((error) => {
                console.error('Erro ao excluir paciente:', error);
                setErroMessage('Erro ao excluir paciente.');
            });
    };

    const handleCadastroSubmit = async (formData: FormData) => {
        let url = 'http://localhost:8080/api/paciente'
        if (editingPaciente) {
            formData.append('id', ""+editingPaciente.id);
            url = 'http://localhost:8080/api/pacientea'
        }
        console.log(url)
        console.log('\n\nFoto')
        console.log(formData.get("foto"))
    
        try {
            const response = await fetch(url, {
                method:'POST',
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                const updatedPacientes = editingPaciente
                    ? pacientes.map((paciente) => (paciente.id === editingPaciente.id ? { ...paciente, ...data } : paciente))
                    : [...pacientes, data];
    
                setPacientes(updatedPacientes);
                buscar();
                setSucessoMessage(`Paciente ${editingPaciente ? 'atualizado' : 'inserido'} com sucesso.`);
                setModalVisible(false);
            } else {
                throw new Error(`Erro ao ${editingPaciente ? 'atualizar' : 'inserir'} paciente.`);
            }
        } catch (error) {
            console.error(`Erro ao ${editingPaciente ? 'atualizar' : 'inserir'} paciente:`, error);
            setErroMessage(`Erro ao ${editingPaciente ? 'atualizar' : 'inserir'} paciente.`);
        }
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
        fetch(`http://localhost:8080/api/pacientenome?nome=${searchValue}`)
            .then((response) => response.json())
            .then((data) => {
                setPacientes(data);
            })
            .catch((error) => {
                console.error('Erro ao pesquisar pacientes:', error);
                setErroMessage('Erro ao pesquisar pacientes.');
            });
    };

    // Função para lidar com a seleção de imagem


    return (
        <Layout>
            <Header style={{ backgroundColor: 'transparent', color: 'white', textAlign: 'center', padding: '16px 0' }}>
                <Title level={2}>Lista de Pacientes</Title>
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
                    Cadastrar Paciente
                </Button>
                <PacienteModal
                    visible={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingPaciente(null);
                    }}
                    onSubmit={handleCadastroSubmit}
                    pacienteToEdit={editingPaciente}
                />
                <TabelaPaciente dataSource={pacientes} onEditar={handleEditar} onExcluir={handleExcluir} />
            </Content>
        </Layout>
    );
}

export default App;
