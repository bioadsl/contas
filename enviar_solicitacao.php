<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];

    // Destinatário do e-mail (endereço de e-mail do administrador)
    $destinatario = 'fabricio.4135@gmail.com'; // Substitua pelo endereço de e-mail do administrador

    // Assunto do e-mail
    $assunto = 'Solicitação de Reativação de Conta';

    // Mensagem de e-mail padrão
    $mensagem_email = "Solicitação de reativação de conta para o usuário $nome ($email).";

    // Envie o e-mail
    if (mail($destinatario, $assunto, $mensagem_email)) {
        echo "Vamos enviar a solicitação. Você será redirecionado para a tela de login em breve.";

        // Aguarde por 2 segundos (você pode ajustar o tempo conforme necessário)
        sleep(2);

        // Redirecione com um parâmetro de sucesso
        header('Location: login.php?sucesso=solicitacao_enviada');
        exit(); // Certifique-se de sair para evitar que o código continue a ser executado
    } else {
        echo "Erro ao enviar a solicitação. Por favor, tente novamente mais tarde.";

        // Aguarde por 2 segundos (você pode ajustar o tempo conforme necessário)
        sleep(2);

        header('Location: login.html');
    }
}
?>
