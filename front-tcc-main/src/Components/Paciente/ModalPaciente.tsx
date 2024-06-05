import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, Image, DatePicker, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';



const formatPhoneNumber = (value: string | undefined): string => {
    if (!value) return '';
    const cleanedValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const match = cleanedValue.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
};

interface PacienteModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    pacienteToEdit: PacienteData | null;
}

interface PacienteData {
    id: number;
    nome: string;
    datanascimento: moment.Moment | null;
    telefone: string;
    sexo: 'Masculino' | 'Feminino';
    cordapele: string;
    estadocivil: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)';
    responsavel: string;
    profissaoresponsavel: string;
    altura: number;
    peso: number;
    idade: number;
}

const PacienteModal: React.FC<PacienteModalProps> = ({ visible, onCancel, onSubmit, pacienteToEdit }) => {
    const [form] = Form.useForm();
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [idade, setIdade] = useState<number | null>(null); // Adicione um estado local para idade

    useEffect(() => {
        if (pacienteToEdit) {
            form.setFieldsValue({
                ...pacienteToEdit,
                datanascimento: pacienteToEdit.datanascimento ? moment(pacienteToEdit.datanascimento, dateFormat) : null,
            });

        }
    }, [pacienteToEdit, form]);

    const calculateAge = (dateOfBirth: Date | null): number | null => {
        if (!dateOfBirth) return null;
    
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            // Ainda não fez aniversário neste ano
            setIdade(age-1)
            return age - 1;
        } else {
            setIdade(age)
            return age;
        }
    };

    const onFinish = (values: any) => {
        const formData = new FormData();
        const dataNascimentoFormatted = values.datanascimento.format("YYYY-MM-DD");
        const pacienteData = {
            nome: values.nome,
            datanascimento: dataNascimentoFormatted,
            telefone: values.telefone,
            sexo: values.sexo,
            cordapele: values.cordapele,
            estadocivil: values.estadocivil,
            responsavel: values.responsavel,
            profissaoresponsavel: values.profissaoresponsavel,
            altura: values.altura,
            peso: values.peso,
            idade: values.idade
        };
        console.log(pacienteData)
        const pacienteBlob = new Blob([JSON.stringify(pacienteData)], { type: 'application/json' });
        formData.append("paciente", pacienteBlob);

        if (selectedFile) {
            formData.append("foto", selectedFile);
        }

        onSubmit(formData);
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const beforeUpload = (file: File) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        return false;
    };

    return (
        <Modal
            visible={visible}
            title={pacienteToEdit ? 'Editar Paciente' : 'Cadastrar Paciente'}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit}>
                    {pacienteToEdit ? 'Editar' : 'Cadastrar'}
                </Button>,
            ]}
        >
            <Form form={form} name="cadastro_paciente" onFinish={onFinish}>
                <Form.Item
                    label="Foto"
                    name="foto"
                    getValueFromEvent={() => { }}
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        listType="picture-card"
                        showUploadList={false}
                    >
                        {fotoPreview ? (
                            <Image
                                src={fotoPreview}
                                alt="Foto do Paciente"
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <div>
                                <UploadOutlined />
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Nome"
                    name="nome"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira o nome do paciente.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Data de Nascimento"
                    name="datanascimento"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira a data de nascimento do paciente.',
                        },
                    ]}
                >
                    <DatePicker
                        format={dateFormat}
                        onChange={(date, dateString) => {
                            const age = calculateAge(date ? date.toDate() : null);
                            form.setFieldsValue({ idade: age !== null ? age.toString() : '' });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Telefone"
                    name="telefone"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira o número de telefone do paciente.',
                        },
                    ]}
                >
                    <Input
                        addonBefore="+55"
                        maxLength={15}
                        onChange={(e) => {
                            // Remove não números
                            const formattedValue = formatPhoneNumber(e.target.value);
                            form.setFieldsValue({ telefone: formattedValue });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Sexo"
                    name="sexo"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, selecione o sexo do paciente.',
                        },
                    ]}
                >
                    <Select>
                        <Option value="Masculino">Masculino</Option>
                        <Option value="Feminino">Feminino</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Cor da Pele"
                    name="cordapele"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, selecione a cor da pele do paciente.',
                        },
                    ]}
                >
                    <Select>
                        <Option value="Preto">Preto</Option>
                        <Option value="Branco">Branco</Option>
                        <Option value="Pardo">Pardo</Option>
                        <Option value="Amarelo">Amarelo</Option>
                        <Option value="Indígena">Indígena</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Estado Civil"
                    name="estadocivil"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, selecione o estado civil do paciente.',
                        },
                    ]}
                >
                    <Select>
                        <Option value="Solteiro(a)">Solteiro(a)</Option>
                        <Option value="Casado(a)">Casado(a)</Option>
                        <Option value="Divorciado(a)">Divorciado(a)</Option>
                        <Option value="Viúvo(a)">Viúvo(a)</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Responsável"
                    name="responsavel"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira o nome do responsável do paciente.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Profissão do Responsável"
                    name="profissaoresponsavel"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira a profissão do responsável do paciente.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Idade"
                    name="idade"
                >
                    <Input
                        readOnly
                        value={idade !== null ? idade.toString() : ''}
                    />
                </Form.Item>

                <Form.Item
                    label="Altura (cm)"
                    name="altura"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (value && value > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('A altura deve ser um número maior que 0.'));
                            },
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Peso (kg)"
                    name="peso"
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (value && value > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('O peso deve ser um número maior que 0.'));
                            },
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PacienteModal;
