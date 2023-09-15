-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15-Set-2023 às 05:44
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `controle_contas`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `contas`
--

CREATE TABLE `contas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `vencimento` date NOT NULL,
  `empresa` varchar(50) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `cod_barras` varchar(100) NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `contas`
--

INSERT INTO `contas` (`id`, `usuario_id`, `descricao`, `vencimento`, `empresa`, `valor`, `cod_barras`, `data_pagamento`, `status`) VALUES
(1, 1, 'Conta de Água', '2023-01-01', 'Água', '100.00', '12345678901234567890123456789012345678901234567890', '2023-01-05', 'paga'),
(2, 1, 'Conta de Luz', '2023-01-02', 'Luz', '110.00', '23456789012345678901234567890123456789012345678901', '2023-01-03', 'paga'),
(3, 1, 'Conta de Gás', '2023-01-03', 'Gás', '120.00', '34567890123456789012345678901234567890123456789012', '2023-01-04', 'paga'),
(4, 1, 'Prestação do Carro', '2023-01-04', 'Carro', '130.00', '45678901234567890123456789012345678901234567890123', '2023-01-05', 'paga'),
(5, 1, 'Aluguel da Loja', '2023-01-05', 'Aluguel', '140.00', '56789012345678901234567890123456789012345678901234', '0000-00-00', 'paga'),
(6, 1, 'Troca de Óleo', '2023-01-06', 'Óleo', '150.00', '67890123456789012345678901234567890123456789012345', '2023-01-07', 'paga'),
(7, 1, 'Condomínio', '2023-01-07', 'Condomínio', '160.00', '78901234567890123456789012345678901234567890123456', '2023-01-08', 'paga'),
(8, 1, 'Cartão de Crédito', '2023-01-08', 'Cartão', '170.00', '89012345678901234567890123456789012345678901234567', '2023-01-09', 'paga'),
(9, 1, 'Colégio', '2023-01-09', 'Colégio', '180.00', '90123456789012345678901234567890123456789012345678', '2023-01-10', 'paga'),
(10, 1, 'Faculdade', '2023-01-10', 'Faculdade', '190.00', '01234567890123456789012345678901234567890123456789', '2023-01-11', 'paga'),
(11, 1, 'Troca de Pneus', '2023-09-01', 'Pneus', '200.00', '12345678901234567890123456789012345678901234567890', NULL, 'vencida'),
(12, 1, 'Consórcio', '2023-09-02', 'Consórcio', '210.00', '23456789012345678901234567890123456789012345678901', NULL, 'vencida'),
(13, 1, 'Pacote de Viagens', '2023-09-03', 'Viagens', '220.00', '34567890123456789012345678901234567890123456789012', NULL, 'vencida'),
(14, 1, 'Uniforme', '2023-09-04', 'Uniforme', '230.00', '45678901234567890123456789012345678901234567890123', NULL, 'vencida'),
(15, 1, 'Pintura da Loja', '2023-09-05', 'Pintura', '240.00', '56789012345678901234567890123456789012345678901234', '0000-00-00', 'vencida'),
(16, 1, 'Móveis Planejados', '2023-09-06', 'Móveis', '250.00', '67890123456789012345678901234567890123456789012345', NULL, 'vencida'),
(17, 1, 'Material de Escritório', '2023-09-07', 'Escritório', '260.00', '78901234567890123456789012345678901234567890123456', NULL, 'vencida'),
(18, 1, 'Licença de Software', '2023-09-08', 'Software', '270.00', '89012345678901234567890123456789012345678901234567', NULL, 'vencida'),
(19, 1, 'Computadores', '2023-09-09', 'Computadores', '280.00', '90123456789012345678901234567890123456789012345678', NULL, 'vencida'),
(20, 1, 'Eletricista', '2023-09-10', 'Eletricista', '290.00', '01234567890123456789012345678901234567890123456789', NULL, 'vencida'),
(21, 1, 'Conta de Internet', '2023-08-11', 'Internet', '95.00', '12345678901234567890123456789012345678901234567890', NULL, 'vencida'),
(22, 1, 'Conta de Telefone', '2023-08-12', 'Telefone', '75.00', '23456789012345678901234567890123456789012345678901', NULL, 'vencida'),
(23, 1, 'Conta de TV a Cabo', '2023-08-13', 'TV a Cabo', '85.00', '34567890123456789012345678901234567890123456789012', '0000-00-00', 'vencida'),
(24, 1, 'Manutenção do Carro', '2023-07-14', 'Carro', '120.00', '45678901234567890123456789012345678901234567890123', '0000-00-00', 'vencida'),
(25, 1, 'Aluguel do Escritório', '2023-08-15', 'Escritório', '350.00', '56789012345678901234567890123456789012345678901234', '0000-00-00', 'vencida'),
(26, 1, 'Assinatura de Jornal', '2023-09-01', 'Jornal', '45.00', '67890123456789012345678901234567890123456789012345', '0000-00-00', 'vencida'),
(27, 1, 'Seguro de Saúde', '2023-09-09', 'Saúde', '180.00', '78901234567890123456789012345678901234567890123456', '0000-00-00', 'vencida'),
(28, 1, 'Impostos', '2023-07-18', 'Impostos', '650.00', '89012345678901234567890123456789012345678901234567', '0000-00-00', 'vencida'),
(29, 1, 'Material Escolar', '2023-08-19', 'Escolar', '55.00', '90123456789012345678901234567890123456789012345678', '0000-00-00', 'vencida'),
(30, 1, 'Manutenção de Computadores', '2023-08-20', 'Computadores', '130.00', '01234567890123456789012345678901234567890123456789', '0000-00-00', 'vencida'),
(31, 1, 'Serviço de Limpeza', '2023-09-21', 'Limpeza', '75.00', '12345678901234567890123456789012345678901234567890', NULL, 'vencida'),
(32, 1, 'Conta de Energia', '2023-09-22', 'Energia', '110.00', '23456789012345678901234567890123456789012345678901', NULL, 'vencida'),
(33, 1, 'Assinatura de Revista', '2023-09-23', 'Revista', '35.00', '34567890123456789012345678901234567890123456789012', NULL, 'vencida'),
(34, 1, 'Manutenção do Alarme', '2023-09-08', 'Alarme', '90.00', '45678901234567890123456789012345678901234567890123', '0000-00-00', 'vencida'),
(35, 1, 'Aluguel do Espaço', '2023-09-25', 'Espaço', '280.00', '56789012345678901234567890123456789012345678901234', NULL, 'vencida'),
(36, 1, 'Conta de Água', '2023-10-01', 'Água', '75.00', '67890123456789012345678901234567890123456789012345', NULL, 'vencida'),
(37, 1, 'Conta de Luz', '2023-10-02', 'Luz', '85.00', '78901234567890123456789012345678901234567890123456', NULL, 'vencida'),
(38, 1, 'Conta de Gás', '2023-10-03', 'Gás', '95.00', '89012345678901234567890123456789012345678901234567', NULL, 'vencida'),
(39, 1, 'Manutenção do Site', '2023-10-04', 'Site', '110.00', '90123456789012345678901234567890123456789012345678', NULL, 'vencida'),
(40, 1, 'Manutenção do Sistema', '2023-10-05', 'Sistema', '130.00', '01234567890123456789012345678901234567890123456789', NULL, 'vencida'),
(41, 1, 'Conta de Água', '2023-10-15', 'Água', '75.00', '12345678901234567890123456789012345678901234567890', NULL, 'vencida'),
(42, 1, 'Conta de Luz', '2023-10-16', 'Luz', '85.00', '23456789012345678901234567890123456789012345678901', NULL, 'vencida'),
(43, 1, 'Conta de Gás', '2023-10-17', 'Gás', '95.00', '34567890123456789012345678901234567890123456789012', NULL, 'vencida'),
(44, 1, 'Manutenção do Site', '2023-10-18', 'Site', '110.00', '45678901234567890123456789012345678901234567890123', NULL, 'vencida'),
(45, 1, 'Manutenção do Sistema', '2023-10-19', 'Sistema', '120.00', '56789012345678901234567890123456789012345678901234', NULL, 'vencida');

-- --------------------------------------------------------

--
-- Estrutura da tabela `recuperacao_senha`
--

CREATE TABLE `recuperacao_senha` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `privilegio` enum('normal','admin') NOT NULL DEFAULT 'normal',
  `status` varchar(10) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `privilegio`, `status`, `foto_perfil`) VALUES
(1, 'Fabricio Duarte Alves', 'fabricio.4135@gmail.com', '$2y$10$gN/bnkrUEe6EbiA.b1vNWufeRZEJQLQL.0hIfuEeNdIHxEYdkmV9m', 'admin', 'ativo', '64f28f4f6b8eb.jpg'),
(2, 'teste', 'teste@teste.com', '$2y$10$gN/bnkrUEe6EbiA.b1vNWufeRZEJQLQL.0hIfuEeNdIHxEYdkmV9m', 'admin', 'ativo', NULL),
(3, 'bio', 'bioadsl@gmail.com', '$2y$10$/m4K1fg9PWNwg0Sf/0Bxk.H.mL3.0hU1QRRQz3UiV21InecrW8zku', '', 'ativo', NULL),
(4, 'luana', 'luana@contas.com', '$2y$10$csOG4QPyHZGuBEFGC1j8FePJSjVoOYuOXVfZ/.u5qdOPeI8BYYlpO', 'admin', 'inativo', 'Assets/uploads/luana.jfif'),
(5, 'Rodrigo marques', 'rodrigoicco@gmail.com', '$2y$10$lIZFBKi1ciRTaQpAwS/24eDDinn37Z3q8T2UqGHVXAFG13vNZdp3i', '', 'ativo', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `contas`
--
ALTER TABLE `contas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices para tabela `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `contas`
--
ALTER TABLE `contas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de tabela `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `contas`
--
ALTER TABLE `contas`
  ADD CONSTRAINT `contas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Limitadores para a tabela `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  ADD CONSTRAINT `recuperacao_senha_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
