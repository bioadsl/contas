<?php
require_once 'Conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario_id = $_POST['usuario_id'];
    $empresa = $_POST['empresa'];
    $cod_barras = $_POST['cod_barras'];
    $vencimento = $_POST['vencimento'];
    $valor = $_POST['valor'];

    $conexao = new Conn();
    $mysqli = $conexao->getConexao();

    // Insere a nova conta no banco de dados
    $insercao = "INSERT INTO contas (usuario_id, empresa, cod_barras, vencimento, valor) VALUES ('$usuario_id', '$empresa', '$cod_barras', '$vencimento', '$valor')";

    if ($mysqli->query($insercao)) {
        echo "Conta cadastrada com sucesso!";
    } else {
        echo "Erro ao cadastrar conta: " . $mysqli->error;
    }

    $conexao->fecharConexao();
}
?>