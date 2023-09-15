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
    <title>Editar Conta</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>

<?php
require_once 'Menu.class.php';
Menu::render();
?>

<div class="container mt-5">
    <h2>Editar Conta</h2>

    <?php
    error_reporting(E_ERROR | E_PARSE);
    require_once 'Conn.php';

    // Verifique se foi passado o ID da conta a ser editada
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        $id = $_GET['id'];
        
        // Recupere os dados da conta pelo ID
        $conexao = new Conn();
        $mysqli = $conexao->getConexao();
        
        $consulta = "SELECT id, empresa, cod_barras, vencimento, valor, data_pagamento, status FROM contas WHERE id = $id";
        $resultado = $mysqli->query($consulta);
        
        if ($resultado && $resultado->num_rows > 0) {
            $conta = $resultado->fetch_assoc();
            
            // Formulário para editar a conta
            echo "<form method='post' action='editar_conta_backend.php'>";
            echo "<input type='hidden' name='id' value='{$id}'>";
            
            echo "<div class='form-group'>";
            echo "<label for='empresa'>Empresa:</label>";
            echo "<input type='text' class='form-control' id='empresa' name='empresa' value='{$conta['empresa']}' required>";
            echo "</div>";
            
            echo "<div class='form-group'>";
            echo "<label for='cod_barras'>Código de Barras:</label>";
            echo "<input type='text' class='form-control' id='cod_barras' name='cod_barras' value='{$conta['cod_barras']}' required>";
            echo "</div>";
            
            echo "<div class='form-group'>";
            echo "<label for='vencimento'>Vencimento:</label>";
            echo "<input type='date' class='form-control' id='vencimento' name='vencimento' value='{$conta['vencimento']}' required>";
            echo "</div>";
            
            echo "<div class='form-group'>";
            echo "<label for='valor'>Valor:</label>";
            echo "<input type='text' class='form-control' id='valor' name='valor' value='{$conta['valor']}' required>";
            echo "</div>";

            echo "<div class='form-group'>";
            echo "<label for='dataPagamento'>Data de Pagamento:</label>";
            echo "<input type='date' class='form-control' id='data_pagamento' name='data_pagamento' value='{$conta['data_pagamento']}'>";
            echo "</div>";
            
            
            echo "<div class='form-group'>";
            echo "<label for='status'>Status:</label>";
            echo "<select class='form-control' id='status' name='status' required>";
            echo "<option value='aberta' " . ($conta['status'] === 'aberta' ? 'selected' : '') . ">aberta</option>";
            echo "<option value='paga' " . ($conta['status'] === 'paga' ? 'selected' : '') . ">paga</option>";
            echo "<option value='cancelada' " . ($conta['status'] === 'cancelada' ? 'selected' : '') . ">cancelada</option>";
            echo "<option value='vencida' " . ($conta['status'] === 'vencida' ? 'selected' : '') . ">vencida</option>";
            echo "</select>";
            echo "</div>";
            echo "<button type='button' class='btn btn-secondary' onclick='voltar()'>Voltar</button>";
            echo "       ";
            echo "<button type='submit' class='btn btn-primary'>Salvar</button>";
            echo "</form>";
        } else {
            echo "<p>Conta não encontrada.</p>";
        }
        
        $conexao->fecharConexao();
    } else {
        echo "<p>Parâmetro de ID ausente ou inválido.</p>";
    }
    ?>
</div>

<!-- Adicione os links para os arquivos JavaScript do Bootstrap -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script>
        // Função para voltar para a página anterior
        function voltar() {
            history.back();
        }
    </script>
</body>
</html>
