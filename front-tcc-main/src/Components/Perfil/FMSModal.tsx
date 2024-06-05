import React, { useState } from 'react';
import { Modal, Row, Col, Radio, Button,message } from 'antd';
import { error } from 'console';

interface OptionProps {
  value: string;
  selected: boolean;
  onChange: () => void;
  imageUrl: string;
  alt: string;
}

const OptionButton: React.FC<OptionProps> = ({ value, selected, onChange, imageUrl, alt }) => (
  <Col span={8}>
    <Radio.Button
      value={value}
      style={{
        width: '150px',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: selected ? '2px solid #1890ff' : '2px solid #d9d9d9',
        borderRadius: '8px',
        padding: '10px',
        background: selected ? '#f0f5ff' : 'transparent',
        marginTop:'10px',
      }}
      checked={selected}
      onChange={onChange}
    >
      <img src={imageUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Radio.Button>
  </Col>
);

const FMSModal: React.FC<{ showFMSModal: boolean; idpaciente: Number | undefined; setShowFMSModal: (show: boolean) => void; buscarResultadosFMS:()=>void}> = ({ showFMSModal, setShowFMSModal, idpaciente ,buscarResultadosFMS}) => {
  const [selectedOption1, setSelectedOption1] = useState<string>('');
  const [selectedOption2, setSelectedOption2] = useState<string>('');
  const [selectedOption3, setSelectedOption3] = useState<string>('');
  const [fms, setFms] = useState<Array<Object>>([{}])

  const getNivelDescricao = (selectedOption: string): { nivel: number, descricao: string } => {
    let nivel = 0;
    let descricao = '';

    switch (selectedOption) {
      case 'cadeira':
        nivel = 1;
        descricao = 'Usa cadeira de rodas: Pode se levantar para mudar de lugar, pode subir alguns degraus com ajuda de outra pessoa ou usando andador.';
        break;
      case 'andador':
        nivel = 2;
        descricao = 'Usa andador: Sem ajuda de outra pessoa.';
        break;
      case 'muleta':
        nivel = 3;
        descricao = 'Usa muletas: Sem ajuda de outra pessoa.';
        break;
      case 'bengala':
        nivel = 4;
        descricao = 'Usa bengalas (uma ou duas): Sem ajuda de outra pessoa.';
        break;
      case 'anda':
        nivel = 5;
        descricao = 'Independente em superfície térrea: Não usa apoio para locomoção nem precisa de ajuda de outra pessoa.* Precisa de corrimão para usar escadas. *Caso use móveis, paredes, cercas, fachada de lojas para se apoiar, favor usar a classificação 4 como descrição apropriada.';
        break;
      case 'independente':
        nivel = 6;
        descricao = 'Independente em todas as superfícies: A criança não usa apoio para locomoção e não precisa de ajuda de outra pessoa para andar em todas as superfícies, incluindo terreno desnivelado, calçadas etc e em ambiente com multidão.';
        break;
      default:
        break;
    }

    return { nivel, descricao };
  };

  const saveQuestionnaire = async () => {
    let hasCompletedFMS = false;
  
    // Código para verificar se o paciente já completou o teste FMS
    await fetch(`http://localhost:8080/api/fms/${idpaciente}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.length > 0) {
          message.error("Paciente já realizou o teste FMS");
          hasCompletedFMS = true;
          alert("teste")
        }
      })
      .catch((error) => {
        message.error('Erro ao pesquisar monitores:', error);
      });
  
    if (!hasCompletedFMS) {
      // Código para salvar as respostas do questionário FMS
      for (let i = 1; i <= 3; i++) {
        const selectedOption = i === 1 ? selectedOption1 : i === 2 ? selectedOption2 : selectedOption3;
        const { nivel, descricao } = getNivelDescricao(selectedOption);
  
        const formData = {
          paciente: {
            id: idpaciente,
          },
          questao: i,
          nivel,
          descricao,
        };

        console.log(formData)
  
        await fetch('http://localhost:8080/api/fms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
          // Lógica para lidar com a resposta da API, se necessário

        })
        .catch((error) => {

        });
      }
  
      // Após salvar, limpar as respostas e fechar o modal
      setSelectedOption1('');
      setSelectedOption2('');
      setSelectedOption3('');
      // Definir o estado para fechar o modal
      await buscarResultadosFMS()
      message.success("Teste realizado com sucesso!!!")
      setShowFMSModal(false);
    }
  };

  return (
    <Modal
      title="FMS - Editar Resultado"
      visible={showFMSModal}
      onCancel={() => {
        setSelectedOption1('');
        setSelectedOption2('');
        setSelectedOption3('');
        setShowFMSModal(false);
      }}
      footer={[
        <Button key="cancel" onClick={() => setShowFMSModal(false)}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={saveQuestionnaire}>
          Salvar
        </Button>,
      ]}
    >
      <div>
        <p>Selecione a opção que melhor representa a mobilidade funcional:</p>
        <br />
        <div>
          <p>Como sua criança se locomove em curtas distâncias em casa? (5m)</p>
          <Row gutter={[16, 16]}>
            {['cadeira', 'andador', 'muleta', 'bengala', 'anda', 'independente'].map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                selected={selectedOption1 === option}
                onChange={() => setSelectedOption1(option)}
                imageUrl={`../${option}.png`}
                alt={`Opção ${index + 1}`}
              />
            ))}
          </Row>
        </div>
        <div>
          <p>Como sua criança se locomove na sala de aula e entre as salas na escola? (50m)</p>
          <Row gutter={[16, 16]}>
            {['cadeira', 'andador', 'muleta', 'bengala', 'anda', 'independente'].map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                selected={selectedOption2 === option}
                onChange={() => setSelectedOption2(option)}
                imageUrl={`../${option}.png`}
                alt={`Opção ${index + 1}`}
              />
            ))}
          </Row>
        </div>
        <div>
          <p>Como sua criança se locomove em longas distâncias, como por exemplo para ir ao shopping center? (500m)</p>
          <Row gutter={[16, 16]}>
            {['cadeira', 'andador', 'muleta', 'bengala', 'anda', 'independente'].map((option, index) => (
              <OptionButton
                key={index}
                value={option}
                selected={selectedOption3 === option}
                onChange={() => setSelectedOption3(option)}
                imageUrl={`../${option}.png`}
                alt={`Opção ${index + 1}`}
              />
            ))}
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default FMSModal;
