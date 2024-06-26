import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';


const RelatorioPaciente = () => {
    const [pacientes, setPacientes] = useState([]);
    const [relatorios, setRelatorios] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        // Fetch patients data
        axios.get('http://localhost:8080/api/paciente')
            .then(response => setPacientes(response.data))
            .catch(error => console.error('Erro ao buscar pacientes:', error));
    }, []);

    const handlePacienteChange = (event) => {
        const pacienteId = event.target.value;
        setSelectedPaciente(pacienteId);

        if (pacienteId) {
            // Fetch report data for selected patient
            axios.get(`http://localhost:8080/api/resultado/paciente/${pacienteId}`)
                .then(response => setRelatorios(response.data))
                .catch(error => console.error('Erro ao buscar relatórios:', error));
        } else {
            setRelatorios([]);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório do Paciente", 10, 10);
        doc.fromHTML(componentRef.current, 10, 20);
        doc.save("relatorio.pdf");
    };

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h2>Relatório de Paciente</h2>
                    <Form.Group controlId="pacienteSelect">
                        <Form.Label>Selecione o Paciente</Form.Label>
                        <Form.Control as="select" onChange={handlePacienteChange}>
                            <option value="">Selecione...</option>
                            {pacientes.map(paciente => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.nome}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            {selectedPaciente && (
                <Row>
                    <Col>
                        <div ref={componentRef}>
                            <h3>Relatórios</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Data</th>
                                        <th>Porcentagem</th>
                                        <th>Detalhes da Sessão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatorios.map((relatorio, index) => (
                                        <tr key={relatorio.id}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(relatorio.data).toLocaleDateString()}</td>
                                            <td>{relatorio.porcentagem}%</td>
                                            <td>
                                                <strong>Sessão:</strong> {relatorio.sessao.nome}<br />
                                                <strong>Data:</strong> {new Date(relatorio.sessao.data).toLocaleDateString()}<br />
                                                <strong>Exercícios:</strong>
                                                <ul>
                                                    {relatorio.sessao.lista.map((item, idx) => (
                                                        <li key={idx}>
                                                            {item.exercicio.nome} - Velocidade: {item.velocidade}, Duração: {item.duracao}, Intervalo: {item.intervalo}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <Button variant="primary" onClick={handlePrint}>Imprimir</Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default RelatorioPaciente;
