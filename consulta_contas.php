<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Consulta de Contas</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Adicione o link para o CSS do DataTables para estilos de tabela aprimorados -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"> <!-- Adicione o link para a biblioteca Font Awesome -->
    <style>
        .vencimento-alert {
            background-color: blue;
        }

        .vencimento-alert-yellow {
            background-color: yellow;
        }

        .vencimento-alert-orange {
            background-color: orange;
        }

        .vencimento-alert-red {
            background-color: red;
        }

        .vencimento-alert-blue {
            background-color: blue;
        }

        .vencimento-alert-gray {
            background-color: gray;
        }

        .vencimento-alert-green {
            background-color: green;
        }

        .vencimento-alert-white {
            background-color: white;
        }

        /* Estilo para os cards */
        .card {
            margin-bottom: 20px;
        }

        .card-header {
            background-color: #f8f9fa;
        }

        .card-body {
            padding: 20px;
        }
    </style>
</head>

<body>

    <?php
    require_once 'Menu.class.php';
    Menu::render();
    ?>

    <div class="container mt-5">
        <h2>Consulta de Contas</h2>

        <?php
        error_reporting(E_ERROR | E_PARSE);
        require_once 'Conn.php';

        $conexao = new Conn();
        $mysqli = $conexao->getConexao();
        $consulta = "SELECT id, empresa, cod_barras, vencimento, valor, data_pagamento, status FROM contas";
        $resultado = $mysqli->query($consulta);

        if ($resultado && $resultado->num_rows > 0) {
            while ($conta = $resultado->fetch_assoc()) {
                // Calcular os dias até o vencimento
                $dataVencimento = strtotime($conta['vencimento']);
                $hoje = strtotime(date('Y-m-d'));
                $diasAteVencimento = ($dataVencimento - $hoje) / (60 * 60 * 24);

                // Definir a classe CSS com base no status e nos dias até o vencimento
                $vencimentoAlertClass = '';
                if ($conta['status'] === 'aberta' || $conta['status'] === 'cancelada') {
                    if ($diasAteVencimento <= 0) {
                        $vencimentoAlertClass = 'vencimento-alert-red';
                    } elseif ($diasAteVencimento <= 1) {
                        $vencimentoAlertClass = 'vencimento-alert-orange';
                    } elseif ($diasAteVencimento <= 3) {
                        $vencimentoAlertClass = 'vencimento-alert-yellow';
                    } else {
                        $vencimentoAlertClass = 'vencimento-alert-white';
                    }
                } elseif ($conta['status'] === 'paga') {
                    $vencimentoAlertClass = 'vencimento-alert-green';
                } elseif ($conta['status'] === 'vencida') {
                    $vencimentoAlertClass = 'vencimento-alert-gray';
                }
        ?>

<div class="card">
    <div class="card-header">
        <?php echo "<h3>".$conta['empresa'];"</h3>" ?>

        <?php
        $buttonClass = '';
        switch ($conta['status']) {
            case 'aberta':
            case 'cancelada':
                if ($diasAteVencimento <= 0) {
                    $buttonClass = 'btn-danger';
                } elseif ($diasAteVencimento <= 1) {
                    $buttonClass = 'btn-warning';
                } elseif ($diasAteVencimento <= 3) {
                    $buttonClass = 'btn-info';
                } else {
                    $buttonClass = 'btn-primary';
                }
                break;
            case 'paga':
                $buttonClass = 'btn-success'; // Defina a classe para a cor desejada para status "pago"
                break;
            case 'vencida':
                $buttonClass = 'btn-secondary'; // Defina a classe para a cor desejada para status "vencida"
                break;
        }
        ?>
        <!-- <button type="button" class="btn <?//php echo $buttonClass; ?> float-right mt-2 mr-2">O</button> -->
        <button type="button" class="btn <?php echo $buttonClass; ?> float-right mt-2 mr-2">
        <?php
        switch ($conta['status']) {
            case 'aberta':
            case 'cancelada':
                echo '<i class="fas fa-circle"></i>';
                break;
            case 'paga':
                echo '<i class="fas fa-check-circle"></i>';
                break;
            case 'vencida':
                echo '<i class="fas fa-exclamation-circle"></i>';
                break;
        }
        ?>
    </button>

    </div>
    <div class="card-body">
        <p><strong>Vencimento:</strong> <?php echo $conta['vencimento']; ?></p>
        <p><strong>Valor:</strong> <?php echo $conta['valor']; ?></p>
        <p><strong>Data de Pagamento:</strong> <?php echo $conta['data_pagamento']; ?></p>
        <p><strong>Status:</strong> <?php echo $conta['status']; ?></p>
        
        <!-- Botões de ação -->
        <a href="editar_conta.php?id=<?php echo $conta['id']; ?>" class="btn btn-outline-primary float-left mr-2">Editar</a>
        <a href="pagar_conta.php?id=<?php echo $conta['id']; ?>" class="btn btn-outline-success float-right">Pagar</a>
    </div>
    <div class="card-footer">
        <!-- Adicione o botão de alerta de acordo com o status -->
       
    </div>
</div>

        <?php
            }
        } else {
            echo "<p>Nenhum registro de conta encontrado.</p>";
        }

        $conexao->fecharConexao();
        ?>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap e do DataTables -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
</body>

</html>