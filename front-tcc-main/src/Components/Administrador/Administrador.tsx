import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Typography, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Patient {
  id: number;
  nome: string;
  idade: number;
  foto: string;
  responsavel: string;
}

const Administrador: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [qtd, setQtd] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(6); // Número de itens por página
  const history = useNavigate(); // Obtenha o histórico de navegação

  useEffect(() => {
    // Chame a função de busca ao montar o componente ou quando a página ou tamanho da página mudar
    buscar();
    contar();
  }, [currentPage, pageSize]);

  const contar = () => {
    const url = 'http://localhost:8080/api/paciente/qtd';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQtd(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar pacientes:', error);
      });
  };

  const buscar = () => {
    // Calcule o índice inicial com base na página atual e no tamanho da página
    const startIndex = (currentPage - 1) * pageSize;
    const url = `http://localhost:8080/api/paciente/pag?start=${startIndex}&limit=${pageSize}`;

    setPatients([]); // Limpe os pacientes enquanto busca

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar pacientes:', error);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleVerPerfilClick = (patient: Patient) => {
    // Navegue para o perfil do paciente usando uma rota e passe o ID do paciente como parte da URL
    history(`/perfil/${patient.id}`);
  };

  return (
    <div>
      <Title level={2}>Pacientes</Title>
      <Row gutter={16}>
        {patients.map((patient) => (
          <Col key={patient.id} span={8} style={{ marginBottom: 16 }}>
            <Card
              hoverable
              style={{ height: '50%',width:'50%' }} // Defina uma altura fixa para os cards
              cover={<img alt={patient.nome} src={`${patient.foto}`} style={{ maxHeight: '100%' }} />} // Defina uma altura máxima para a imagem
            >
              <Card.Meta
                title={patient.nome}
                description={`Idade: ${patient.idade} | Responsável: ${patient.responsavel}`}
              />
              <Button
                type="primary"
                onClick={() => handleVerPerfilClick(patient)}
                style={{ marginTop: '8px' }} // Adicione uma margem superior ao botão
              >
                Ver Perfil
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        total={qtd} // Substitua pelo número total de pacientes disponíveis
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default Administrador;
