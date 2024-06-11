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
  const [pageSize, setPageSize] = useState<number>(6);
  const navigate = useNavigate();

  useEffect(() => {
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
    const startIndex = (currentPage - 1) * pageSize;
    const url = `http://localhost:8080/api/paciente/pag?start=${startIndex}&limit=${pageSize}`;

    setPatients([]);

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
    navigate(`/perfil/${patient.id}`);
  };

  return (
    <div>
      <Title level={2}>Pacientes</Title>
      <Row gutter={[16, 16]}>
        {patients.map((patient) => (
          <Col key={patient.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              cover={
                <img
                  alt={patient.nome}
                  src={`${patient.foto}`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={patient.nome}
                description={`Idade: ${patient.idade} | Responsável: ${patient.responsavel}`}
              />
              <Button
                type="primary"
                onClick={() => handleVerPerfilClick(patient)}
                style={{ marginTop: '8px' }}
              >
                Ver Perfil
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        total={qtd}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />
    </div>
  );
};

export default Administrador;
