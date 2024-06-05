import { Button, Layout, Table, Typography, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

interface MonitorDataS {
  id: number;
  nome: string;
  email: string;
  ra: string;
  cpf: string;
}

interface TabelaMonitorProps {
  dataSource: MonitorDataS[];
  onEditar: (record: MonitorDataS) => void;
  onExcluir: (id: number) => void; // Corrigido para receber um número
}

function TabelaMonitor({ dataSource, onEditar, onExcluir }: TabelaMonitorProps) {
  const columns = [
   
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'RA',
      dataIndex: 'ra',
      key: 'ra',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    
    {
      title: 'Ação',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: MonitorDataS) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined style={{ color: 'blue' }} />} // Ícone de editar (amarelo)
            onClick={() => onEditar(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: 'red' }} />} // Ícone de excluir (vermelho)
            onClick={() => showConfirm(record.id)}
          />
        </span>
      ),
    }
  ];

  const showConfirm = (id: number) => {
    confirm({
      title: 'Tem certeza de que deseja excluir este registro?',
      onOk() {
        onExcluir(id);
      },
    });
  };

  return <Table dataSource={dataSource} columns={columns} />;
}

export default TabelaMonitor;
