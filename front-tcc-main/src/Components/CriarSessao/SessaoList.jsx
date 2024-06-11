import React, { useState, useEffect } from 'react';
import { Pagination, Row, Col } from 'antd';
import axios from 'axios';
import SessaoCard from './SessaoCard';

const SessaoList = () => {
    const [sessoes, setSessoes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6); // Número de cards por página

    useEffect(() => {
        fetchSessoes();
    }, []);

    const fetchSessoes = () => {
        axios.get('http://localhost:8080/api/sessao')
            .then(response => {
                setSessoes(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar sessões:', error);
            });
    };

    const handleStart = (id) => {
        // Abre o iframe para iniciar a sessão com o ID fornecido
        const iframe = document.createElement('iframe');
        iframe.src = `http://localhost:4000/Sessao.html?id=${id}`;
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.zIndex = '9999';
        iframe.allow = 'camera';
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.appendChild(iframe);

        document.body.appendChild(container);
    };

    const handleDelete = async (id) => {
        const response = await axios.delete(`http://localhost:8080/api/sessaoexercicio/${id}`);
        if(response.data.status === 200){
            await axios.delete(`http://localhost:8080/api/sessao/${id}`)
            .then(() => {
                setSessoes(sessoes.filter(sessao => sessao.id !== id));
                alert('Sessão excluída com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao excluir sessão:', error);
            });
        } else {
            alert("Erro ao excluir");
        }
    };

    // Lógica de paginação
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentSessoes = sessoes.slice(startIndex, endIndex);

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '50px' }}>
                {currentSessoes.map(sessao => (
                    <Col key={sessao.id} xs={24} sm={12} md={8}>
                        <SessaoCard
                            sessao={sessao}
                            onStart={() => handleStart(sessao.id)}
                            onDelete={handleDelete}
                        />
                    </Col>
                ))}
            </Row>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={sessoes.length}
                onChange={page => setCurrentPage(page)}
                style={{ textAlign: 'center', marginTop: '16px' }}
            />
        </div>
    );
};

export default SessaoList;
