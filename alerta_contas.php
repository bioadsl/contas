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
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        .vencimento-alert-orange {
            background-color: orange;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        .vencimento-alert-red {
            background-color: red;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        .vencimento-alert-blue {
            background-color: blue;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        .vencimento-alert-gray {
            background-color: gray;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        .vencimento-alert-green {
            background-color: green;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;

        }

        .vencimento-alert-white {
            background-color: white;
            padding: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 100%;
            display: block;
        }

        /* Estilo personalizado para os ícones */
        .btn-icon i {
            background: none;
            border: none;
            padding: 0;
        }
    </style>
</head>
<body>

<?php
require_once 'Menu.class.php';
Menu::render();
?>

<div class="container mt-5">
    <h2>Alerta Contas</h2>
    <table id="contasTable" class="table table-bordered">
        <thead>
            <tr>
                <th>Empresa</th>
                <!-- <th>Código de Barras</th> -->
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th></th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>

            <?php
            error_reporting(E_ERROR | E_PARSE);
            require_once 'Conn.php';

            $conexao = new Conn();
            $mysqli = $conexao->getConexao();
            $consulta = "SELECT id, empresa, cod_barras, vencimento, valor, data_pagamento, status FROM contas where vencimento + INTERVAL 3 DAY > CURDATE() AND status != 'paga'";
            $resultado = $mysqli->query($consulta);


            if ($resultado && $resultado->num_rows > 0) {
                while ($conta = $resultado->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>{$conta['empresa']}</td>";
                    // echo "<td>{$conta['cod_barras']}</td>";
                    
                    // Calcular os dias até o vencimento
                    $dataVencimento = strtotime($conta['vencimento']);
                    $hoje = strtotime(date('Y-m-d'));
                    $diasAteVencimento = ($dataVencimento - $hoje) / (60 * 60 * 24);
                    
                    // Definir a classe CSS com base nos dias até o vencimento
                    $vencimentoAlertClass = '';
                    if ($conta['status'] === 'aberta'|| $conta['status'] === 'cancelada' ) {
                        if ($diasAteVencimento <= 0) {
                            $vencimentoAlertClass = 'vencimento-alert-red';
                        } elseif ($diasAteVencimento <= 1) {
                            $vencimentoAlertClass = 'vencimento-alert-orange';
                        } elseif ($diasAteVencimento <= 3) {
                            $vencimentoAlertClass = 'vencimento-alert-yellow';
                        } else {
                            $vencimentoAlertClass = 'vencimento-alert-white';
                        }
                    } if ($conta['status'] === 'paga') {
                        $vencimentoAlertClass = 'vencimento-alert-green'; // Defina a classe para a cor desejada para status "pago"
                    }elseif ($conta['status'] === 'vencida') {
                    $vencimentoAlertClass = 'vencimento-alert-gray'; // Defina a classe para a cor desejada para status "pago"
                }
                    
                    echo "<td>{$conta['vencimento']}</td>";
                    echo "<td>{$conta['valor']}</td>";
                    echo "<td>{$conta['data_pagamento']}</td>";
                    echo "<td>{$conta['status']}</td>";
                    echo "<td class='{$vencimentoAlertClass} style='border:1px;'>&nbsp;</td>"; // Coluna de alerta de vencimento com a classe CSS
                    echo "<td>";
                    echo "<a href='editar_conta.php?id={$conta['id']}' class='btn  btn-icon btn-sm'><i class='fas fa-edit'></i></a> ";
                    echo "<a href='pagar_conta.php?id={$conta['id']}' class='btn  btn-icon btn-sm'><i class='fas fa-money-bill-wave'></i></a>";
                    echo "</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='7'>Nenhum registro de conta encontrado.</td></tr>";
            }

            $conexao->fecharConexao();
            ?>

        </tbody>
    </table>
</div>

<!-- Adicione os links para os arquivos JavaScript do Bootstrap e do DataTables -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>

<script>
    $(document).ready(function() {
        $('#contasTable').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/Portuguese-Brasil.json" // Configuração de idioma para português Brasil
            },
            "paging": true, // Ativação da paginação
            "ordering": true, // Ativação da ordenação
            "searching": true, // Ativação da pesquisa
            "info": true // Exibição de informações de tabela (total de registros, página atual etc.)
        });
    });
</script>
</body>
</html>

