import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, List } from 'antd';
import axios from 'axios';
import './sessao.css';

const { Option } = Select;

const CriarSessaoFisioterapia = () => {
    const [exercicios, setExercicios] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [selectedExercicio, setSelectedExercicio] = useState(null);
    const [nomeSessao, setNomeSessao] = useState('');
    const [sessaoExercicios, setSessaoExercicios] = useState([]);
    const [velocidade, setVelocidade] = useState(0);
    const [duracao, setDuracao] = useState(0);
    const [intervalo, setIntervalo] = useState(0);

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchExercicios = () => {
        console.log(selectedPaciente)
        fetch('http://localhost:8080/api/exercicio/buscar/'+selectedPaciente) 
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setExercicios(data);
            })
            .catch((error) => {
                console.error('Erro ao carregar exercícios:', error);
            });
    };

    const fetchPacientes = () => {
        fetch('http://localhost:8080/api/paciente')
            .then((response) => response.json())
            .then((data) => {
                setPacientes(data);
            })
            .catch((error) => {
                console.error('Erro ao carregar pacientes:', error);
            });
    };

    const handleAddExercicio = () => {
        if (selectedExercicio) {
            const exercicio = exercicios.find(ex => ex.arquivo === selectedExercicio);
            if(velocidade < 0){
                alert("Velocidade inválida")
                return;
            }
            if(duracao < 0){
                alert("duração inválida")
                return;
            }
            if(intervalo < 0){
                alert("intervalo inválido")
                return;
            }
            setSessaoExercicios([...sessaoExercicios, { exercicio, velocidade, duracao, intervalo }]);
            setSelectedExercicio(null);
            setVelocidade(0);
            setDuracao(0);
            setIntervalo(0);
        }
    };

    const handleRemoveExercicio = (index) => {
        const newSessaoExercicios = [...sessaoExercicios];
        newSessaoExercicios.splice(index, 1);
        setSessaoExercicios(newSessaoExercicios);
    };

    const handleSalvar = async () => {
        try {
            // Dados da sessão
            let sessaoData = {
                nome: nomeSessao,
                paciente: {
                    id: selectedPaciente
                }
            };

            console.log(sessaoData)

            // Envia a sessão
            const sessaoResponse = await axios.post('http://localhost:8080/api/sessao', sessaoData);

            // Obtém o ID da última sessão inserida
            const ultimaSessaoResponse = await axios.get('http://localhost:8080/api/sessao/ultima');
            const sessaoId = ultimaSessaoResponse.data;

            // Envia os exercícios
            for (const [index, exercicio] of sessaoExercicios.entries()) {
                const sessaoExercicioData = {
                    sessao: { id: sessaoId },
                    exercicio: exercicio.exercicio,
                    ordem: index + 1,
                    velocidade: exercicio.velocidade,
                    duracao: exercicio.duracao,
                    intervalo: exercicio.intervalo
                };
                console.log(sessaoExercicioData)

                await axios.post('http://localhost:8080/api/sessaoexercicio', sessaoExercicioData);
            }

            // Exibe o toast de sucesso
            alert('Sessão salva com sucesso!');

            // Limpa os dados após salvar
            setNomeSessao('');
            setSelectedPaciente(null);
            setSessaoExercicios([]);
        } catch (error) {
            // Exibe o toast de erro
            alert('Erro ao salvar a sessão: ' + error.message);
        }
    };

    const handleIniciar = () => {
        // Lógica para iniciar a sessão
    };

    useEffect(() => {
        if (selectedPaciente !== null) {
          fetchExercicios();
        }
      }, [selectedPaciente]);

    const handleChange = (value) => {
        setSelectedPaciente(value);
      };

    return (
        <div>
            <h1 className="mt-4 mb-4">Criar Sessão de Fisioterapia</h1>
            <Form>
                <Form.Item label="Nome da Sessão">
                    <Input 
                        value={nomeSessao} 
                        onChange={(e) => setNomeSessao(e.target.value)} 
                        disabled={sessaoExercicios.length > 0}
                    />
                </Form.Item>
                <Form.Item label="Paciente">
                    <Select 
                        onChange={handleChange}
                        disabled={sessaoExercicios.length > 0}
                        value={selectedPaciente || ''}
                    >
                        <Option value="">Selecione um paciente</Option>
                        {pacientes.map(paciente => (
                            <Option key={paciente.id} value={paciente.id}>
                                {paciente.nome}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Exercício">
                    <Select value={selectedExercicio || ''} onChange={(value) => setSelectedExercicio(value)}>
                        <Option value="">Selecione um exercício</Option>
                        {exercicios.map(exercicio => (
                            <Option key={exercicio.id} value={exercicio.arquivo}>
                                {exercicio.nome}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {selectedExercicio && (
                    <div className="text-center my-4">
                        <iframe
                            src={`http://localhost:4000/ExibirExercicio.html?arquivo=${selectedExercicio}`}
                            title="Exercício"
                            width="100%"
                            height="400px"
                            className="border"
                            allow="camera"
                        ></iframe>
                    </div>
                )}
                <Row>
                    <Col>
                        <Form.Item label="Velocidade">
                            <Input type="number" step="0.5" value={velocidade} onChange={(e) => setVelocidade(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="Duração">
                            <Input type="number" step="1" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="Intervalo">
                            <Input type="number" step="1" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>
                <Button 
                    type="primary" 
                    className="mb-3" 
                    onClick={handleAddExercicio}
                    disabled={!selectedExercicio}
                >
                    Adicionar Exercício
                </Button>
            </Form>
            <div>
                <h3>Lista de Exercícios da Sessão</h3>
                <List style={{ marginTop: '20px' }}>
                    {sessaoExercicios.map((item, index) => (
                        <List.Item key={index} className="exercise-item">
                            <Row gutter={16} align="middle">
                                <Col span={6}>{item.exercicio.nome}</Col>
                                <Col span={4}>Velocidade: {item.velocidade}</Col>
                                <Col span={4}>Duração: {item.duracao}</Col>
                                <Col span={6}>Intervalo: {item.intervalo}</Col>
                                <Col span={4}>
                                    <Button type="danger" onClick={() => handleRemoveExercicio(index)}>
                                        Remover
                                    </Button>
                                </Col>
                            </Row>
                        </List.Item>
                    ))}
                </List>
            </div>
            <div className="mb-4">
                <Button 
                    className="btn-green" 
                    onClick={handleSalvar}
                    disabled={sessaoExercicios.length === 0}
                >
                    Salvar
                </Button>
                <Button 
                    type="primary" 
                    onClick={handleIniciar}
                    disabled={sessaoExercicios.length === 0}
                >
                    Iniciar
                </Button>
            </div>
        </div>
    );
};

export default CriarSessaoFisioterapia;
