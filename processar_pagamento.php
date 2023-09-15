<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigoBarras = $_POST['codigoBarras'];

    // Verifique se o comprovante de pagamento foi enviado com sucesso
    if (isset($_FILES['comprovante']) && $_FILES['comprovante']['error'] === UPLOAD_ERR_OK) {
        $comprovanteNome = $_FILES['comprovante']['name'];
        $comprovanteTempName = $_FILES['comprovante']['tmp_name'];
        
        // Mova o comprovante de pagamento para um diretório no servidor
        $diretorioDestino = 'Assets/comprovantes/';
        $comprovanteDestino = $diretorioDestino . $comprovanteNome;
        
        if (move_uploaded_file($comprovanteTempName, $comprovanteDestino)) {
            // Atualize o status da conta para "pago" no banco de dados
            require_once 'Conn.php';
            $conexao = new Conn();
            $mysqli = $conexao->getConexao();
            
            $atualizarStatus = "UPDATE contas SET status = 'paga' WHERE cod_barras = '$codigoBarras'";
            
            if ($mysqli->query($atualizarStatus)) {
                echo "Conta paga com sucesso!";
            } else {
                echo "Erro ao atualizar o status da conta: " . $mysqli->error;
            }
            
            $conexao->fecharConexao();
        } else {
            echo "Erro ao fazer upload do comprovante de pagamento.";
        }
    } else {
        echo "Por favor, envie um comprovante de pagamento válido.";
    }

    // Após processar o pagamento com sucesso, adicione o seguinte código para redirecionar o usuário para a tela de consulta de contas:

// Redirecionar para a página de consulta de contas
header("Location: consulta_contas.php");
exit; // Certifique-se de sair do script após o redirecionamento

}
?>
