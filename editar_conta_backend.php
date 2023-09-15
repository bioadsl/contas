<?php
error_reporting(E_ERROR | E_PARSE);
require_once 'Conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $empresa = $_POST['empresa'];
    $cod_barras = $_POST['cod_barras'];
    $vencimento = $_POST['vencimento'];
    $valor = $_POST['valor'];
    $data_pagamnento = $_POST['data_pagamnento'];
    $status = $_POST['status'];
    
    $conexao = new Conn();
    $mysqli = $conexao->getConexao();
    
    $atualizacao = "UPDATE contas SET empresa = '$empresa', cod_barras = '$cod_barras', vencimento = '$vencimento', valor = '$valor', data_pagamento = '$data_pagamento', status = '$status' WHERE id = $id";
    
    if ($mysqli->query($atualizacao) === TRUE) {
        // Redirecionar para a página de consulta de contas após a atualização
        header('Location: consulta_contas.php');
        exit(); // Certifique-se de sair para evitar que o código adicional seja executado
    } else {
        echo "Erro ao atualizar a conta: " . $mysqli->error;
    }
    
    $conexao->fecharConexao();
}
?>
