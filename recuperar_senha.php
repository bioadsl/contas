<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];

    // Verifique se o email existe no banco de dados
    // Se existir, gere um token de recuperação de senha e envie um email com um link de recuperação

    // Lógica para gerar um token e enviar o email
    $token = bin2hex(random_bytes(16)); // Gere um token seguro

    // Salve o token no banco de dados junto com o email e uma data de expiração

    // Envie um email para o usuário com um link contendo o token de recuperação
    $assunto = "Recuperação de Senha";
    $mensagem = "Clique no link a seguir para redefinir sua senha: http://contas/reset_senha.php?token=$token";
    $cabecalhos = "From: fabricio.4135@gmail.com";

    if (mail($email, $assunto, $mensagem, $cabecalhos)) {
        echo "Um email de recuperação de senha foi enviado para o seu endereço de email.";
    } else {
        echo "Ocorreu um erro ao enviar o email.";
    }
}
?>


<!DOCTYPE html>
<html>
<head>
    <title>Recuperar Senha</title>
    <script src="assets/js/color-modes.js"></script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.115.4">
    <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/sign-in/">
    <link rel="stylesheet" href="Assets/css/css@3">
    <link href="Assets/css/dist/bootstrap.min.css" rel="stylesheet">
    <link href="Assets/css/sign-in.css" rel="stylesheet">

</head>
<body>

<div class="card text-center">
            <div class="card-header">
                <h5 class="card-title">Recuperação de Senha</h5>
            </div>
            <div class="card-body">
                        <form action="recuperar_senha.php" method="post">
                            <p class="card-text"> 
                                <label for="email">Digite seu Email:</label>
                                    <input type="email" class="form-control" id="email" name="email" required>
                            </p>
                            <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
                            <button type="submit" class="btn btn-primary">Enviar Email de Recuperação</button>
                        </form>
            </div>
        </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, se necessário -->
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