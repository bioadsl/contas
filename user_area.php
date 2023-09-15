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
    <title>Área Administrativa</title>
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>

    <?php
    require_once 'Menu_user.class.php';
    Menu::render();
    ?>

    <div class="container mt-5">
    <!-- Conteúdo da página da área administrativa -->
    <h2>Bem-vindo à Área Comum</h2>
    <p>Nesta área, você tem acesso funcionalidades do sistema de controle de usuário e perfil.</p>

    <h3>Funcionalidades Disponíveis:</h3>
    <ul>
        <li><strong>Gerenciamento da propria conta:</strong> Cadastre novos usuários, consulte e edite informações de usuários existentes. Você pode definir seus privilégios, tornando o sistema flexível para diferentes funções na empresa.</li>
        <li><strong>Recuperação de Senha:</strong> Caso esqueça sua senha, utilize a opção de recuperação de senha por e-mail para redefini-la de forma segura.</li>
        <li><strong>Perfil do Usuário:</strong> Gerencie suas informações de perfil, incluindo uma foto de perfil personalizada. Mantenha seus dados atualizados.</li>
    </ul>

    <p>Estamos comprometidos em fornecer uma experiência de gerenciamento eficiente e segura para suas contas pessoais e empresariais. Se tiver alguma dúvida ou precisar de suporte, não hesite em entrar em contato conosco.</p>
</div>


    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, se necessário -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>