import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface MonitorModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: MonitorData) => void;
  monitorToEdit: MonitorDataS | null;
}

interface MonitorData {
  id: number;
  nome: string;
  email: string;
  ra: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
}

interface MonitorDataS {
  id: number;
  nome: string;
  email: string;
  ra: string;
  cpf: string;
}

const MonitorModal: React.FC<MonitorModalProps> = ({ visible, onCancel, onSubmit, monitorToEdit }) => {
  const [form] = Form.useForm();
  const [raValue, setRaValue] = useState<string | undefined>(undefined);
  const [cpfValue, setCpfValue] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (monitorToEdit) {
      form.setFieldsValue(monitorToEdit);
      setRaValue(monitorToEdit.ra);
      setCpfValue(monitorToEdit.cpf);
    }
  }, [monitorToEdit, form]);



  const formatCPF = (value: string) => {
    // Aplicar a máscara para o CPF (11 dígitos + pontos e hífen)
    const trimmedValue = value.replace(/[^0-9]/g, ''); // Remover caracteres não numéricos
    const parts = [
      trimmedValue.slice(0, 3),
      trimmedValue.slice(3, 6),
      trimmedValue.slice(6, 9),
      trimmedValue.slice(9, 11),
    ];
    return parts.slice(0, 3).join('.') + '-' + parts[3];
  };

  const onFinish = (values: MonitorData) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields(); // Limpar os campos do formulário ao cancelar
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="Cadastro de Monitor"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          Cadastrar
        </Button>,
      ]}
    >
      <Form form={form} name="cadastro_monitor" onFinish={onFinish}>
        <Form.Item
          label="Nome"
          name="nome"
          rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Por favor, insira o email!' },
            { type: 'email', message: 'Formato de email inválido!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="RA"
          name="ra"
          rules={[
            { required: true, message: 'Por favor, insira o RA!' },
            {
              pattern: /^[0-9]{8,9}$/,
              message: 'RA inválido. Deve ter 8 ou 9 dígitos numéricos com um hífen antes do último caractere!',
            },
          ]}
        >
          <Input maxLength={9} />
        </Form.Item>

        <Form.Item
          label="CPF"
          name="cpf"
          rules={[
            { required: true, message: 'Por favor, insira o CPF!' },
            {
              pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: 'CPF inválido. Deve estar no formato 123.456.789-01!',
            },
          ]}
        >
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const formattedValue = formatCPF(e.target.value);
              setCpfValue(formattedValue);
              e.target.value = formattedValue;
              form.setFieldsValue({ cpf: formattedValue });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="senha"
          rules={[{ required: true, message: 'Por favor, insira a senha!', max: 20 }]}

        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirmar Senha"
          name="confirmarSenha"
          dependencies={['senha']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor, confirme a senha!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('senha') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('As senhas não coincidem!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>


      </Form>
    </Modal>
  );
};

export default MonitorModal;
