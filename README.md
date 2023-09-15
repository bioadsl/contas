# contas
Sistema de controle de vencimento de contas


# Documentação de Requisitos do Sistema

## Introdução

Esta documentação descreve os requisitos do sistema para o "CONTAS". O "CONTAS" é um sistema de gerenciamento de contas e usuários que oferece funcionalidades para controlar contas a pagar, gerenciar usuários e fornecer informações detalhadas sobre o estado das contas.

## Visão Geral do Sistema

O "CONTAS" é uma aplicação web que oferece as seguintes funcionalidades principais:

1. **Gerenciamento de Usuários:**
   - Cadastro de novos usuários.
   - Consulta e edição de informações de usuários existentes.
   - Definição de privilégios para diferentes funções na empresa.

2. **Controle de Contas:**
   - Cadastro de contas a pagar.
   - Visualização e edição de informações de contas existentes.
   - Visão geral das contas pendentes e pagas para auxiliar no planejamento financeiro.

3. **Consulta de Contas:**
   - Pesquisa de contas por empresa, status ou data de vencimento.
   - Tabela ordenável e paginada para facilitar a visualização e análise dos dados.

4. **Recuperação de Senha:**
   - Opção de recuperação de senha por e-mail para usuários que esqueceram suas senhas.

5. **Perfil do Usuário:**
   - Gerenciamento de informações de perfil, incluindo foto de perfil personalizada.

## Requisitos do Sistema

### 1. Gerenciamento de Usuários

1.1. **Cadastro de Usuários:**
   - O sistema deve permitir o cadastro de novos usuários com os seguintes dados: nome, e-mail, senha, privilégio e status.
   - A senha do usuário deve ser armazenada com criptografia.

1.2. **Consulta de Usuários:**
   - Os usuários cadastrados devem ser listados em uma página de consulta.
   - É necessário oferecer opções de pesquisa e ordenação.

1.3. **Edição de Usuários:**
   - Os usuários devem poder editar suas informações, incluindo nome, e-mail e senha.
   - Administradores têm a capacidade de editar todas as informações do usuário.

### 2. Controle de Contas

2.1. **Cadastro de Contas:**
   - O sistema deve permitir o cadastro de contas a pagar com os seguintes dados: empresa, código de barras, data de vencimento, valor, data de pagamento e status.

2.2. **Consulta de Contas:**
   - As contas cadastradas devem ser listadas em uma página de consulta.
   - Os usuários podem pesquisar contas por empresa, status ou data de vencimento.

2.3. **Edição de Contas:**
   - Os usuários devem poder editar informações de contas existentes.

### 3. Calendário de Contas

3.1. **Visualização de Contas em Calendário:**
   - O sistema deve oferecer uma visualização de contas em formato de calendário.
   - Cada conta será representada como um evento no calendário.

3.2. **Cores com Base no Status:**
   - As contas devem ser coloridas com base em seu status:
     - Contas abertas:
       - Vencimento até 0 dias (hoje): Vermelho.
       - Vencimento em 1 dia: Laranja.
       - Vencimento em até 2 dias: Amarelo Queimado.
       - Vencimento em até 3 dias: Amarelo.
       - Vencimento em até 4 dias ou mais: Branco.
     - Contas pagas: Verde.
     - Contas vencidas: Cinza.

3.3. **Responsividade:**
   - A página do calendário deve ser responsiva para se adaptar a diferentes tamanhos de tela.

3.4. **Integração com o FullCalendar:**
   - O calendário deve ser implementado utilizando a biblioteca FullCalendar.

### 4. Atualização Automática de Contas

4.1. **Descrição:**
   - A tarefa da cron é responsável por executar a atualização de contas no sistema.
   - Esta atualização envolve a verificação da data de vencimento de contas em aberto.
   - Se a data de vencimento for maior que a data atual e não houver data de pagamento e/ou o status for "paga", a conta deve ser marcada como "vencida".

4.2. **Execução Periódica:**
   - A tarefa da cron deve ser configurada para ser executada em intervalos regulares, como diariamente ou semanalmente, conforme necessário.

4.3. **Condições de Atualização:**
   - Para cada conta em aberto no sistema, a tarefa da cron deve verificar as seguintes condições:
     - A data de vencimento da conta é maior que a data atual.
     - A data de pagamento da conta é "0000-00-00" ou nula (NULL).
     - O status da conta é "paga".

4.4. **Atualização do Status:**
   - Se todas as condições acima forem atendidas, a tarefa da cron deve atualizar o status da conta para "vencida".

4.5. **Registro de Atualizações:**
   - Após a conclusão da atualização, a tarefa da cron deve registrar um histórico de todas as contas atualizadas.
   - O registro deve incluir o ID da conta, data e hora da atualização e o novo status "vencida".

4.6. **Feedback Visual:**
   - A tarefa da cron deve fornecer um feedback visual sobre o número de contas atualizadas.
   - Isso pode ser realizado por meio de uma barra de progresso ou mensagem de conclusão.

4.7. **Observações:**
   - Certifique-se de que a tarefa da cron seja configurada adequadamente para executar as operações descritas nos requisitos detalhados.
   - A atualização de contas deve ser feita de forma segura, garantindo que não haja perda de dados.


## Conclusão

Este documento descreve os requisitos do sistema para o "CONTAS". Esses requisitos servem como base para o desenvolvimento e teste do sistema, garantindo que ele atenda às necessidades e expectativas dos usuários.

[Fabricio Duarte Alves]
