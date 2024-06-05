import React from 'react';
import { Button, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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

interface TabelaPacienteProps {
  dataSource: PacienteData[];
  onEditar: (record: PacienteData) => void;
  onExcluir: (id: number) => void;
}

const TabelaPaciente: React.FC<TabelaPacienteProps> = ({ dataSource, onEditar, onExcluir }) => {
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Idade',
      dataIndex: 'idade',
      key: 'idade',
    },
    {
      title: 'Data de Nascimento',
      dataIndex: 'datanascimento',
      key: 'datanascimento',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
    },
    {
      title: 'Cor da Pele',
      dataIndex: 'cordapele',
      key: 'cordapele',
    },
    {
      title: 'Estado Civil',
      dataIndex: 'estadocivil',
      key: 'estadocivil',
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      key: 'responsavel',
    },
    {
      title: 'Profissão do Responsável',
      dataIndex: 'profissaoresponsavel',
      key: 'profissaoresponsavel',
    },
    {
      title: 'Altura',
      dataIndex: 'altura',
      key: 'altura',
    },
    {
      title: 'Peso',
      dataIndex: 'peso',
      key: 'peso',
    },
    {
      title: 'Ação',
      dataIndex: 'action',
      key: 'action',
      render: (_text: any, record: PacienteData) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined style={{ color: 'blue' }} />}
            onClick={() => onEditar(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => showConfirm(record.id)}
          />
        </span>
      ),
    },
  ];

  const showConfirm = (id: number) => {
    Modal.confirm({
      title: 'Tem certeza de que deseja excluir este registro?',
      onOk() {
        onExcluir(id);
      },
    });
  };

  return <Table dataSource={dataSource} columns={columns} />;
};

export default TabelaPaciente;
