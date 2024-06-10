import React from 'react';
import { Card, Button, Row, Col } from 'antd';

const SessaoCard = ({ sessao, onStart, onDelete }) => {
    return (
        <Card title={sessao.nome} style={{ marginBottom: 20 }}>
            <p>Paciente: {sessao.paciente.nome}</p>
            <p>Data: {new Date(sessao.data).toLocaleDateString()}</p>
            <h4>Exercícios:</h4>
            <ul>
                {sessao.lista.map((item, index) => (
                    <li key={index}>
                        {item.exercicio.nome} - Velocidade: {item.velocidade}, Duração: {item.duracao}, Intervalo: {item.intervalo}
                    </li>
                ))}
            </ul>
            <Row gutter={16}>
                <Col>
                    <Button type="primary" onClick={() => onStart(sessao.id)}>Iniciar Sessão</Button>
                </Col>
                <Col>
                    <Button type="danger" onClick={() => onDelete(sessao.id)}>Excluir</Button>
                </Col>
            </Row>
        </Card>
    );
};

export default SessaoCard;
