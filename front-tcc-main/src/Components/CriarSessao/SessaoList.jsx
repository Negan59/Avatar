import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import axios from 'axios';
import SessaoCard from './SessaoCard';

const SessaoList = () => {
    const [sessoes, setSessoes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Number of cards per page

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
        // Lógica para iniciar a sessão
        console.log(`Iniciar sessão: ${id}`);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/sessao/${id}`)
            .then(() => {
                setSessoes(sessoes.filter(sessao => sessao.id !== id));
                alert('Sessão excluída com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao excluir sessão:', error);
            });
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentSessoes = sessoes.slice(startIndex, endIndex);

    return (
        <div>
            {currentSessoes.map(sessao => (
                <SessaoCard
                    key={sessao.id}
                    sessao={sessao}
                    onStart={handleStart}
                    onDelete={handleDelete}
                />
            ))}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={sessoes.length}
                onChange={page => setCurrentPage(page)}
                style={{ textAlign: 'center', marginTop: 20 }}
            />
        </div>
    );
};

export default SessaoList;
