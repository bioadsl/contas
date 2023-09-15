<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

$conexao = new Conn();
$mysqli = $conexao->getConexao();

// Consulta para buscar os dados do usuário logado
$consulta = "SELECT id, nome, email, privilegio, foto_perfil, status FROM usuarios WHERE id = $usuario_id";
$resultado = $mysqli->query($consulta);

if ($resultado && $resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
} else {
    echo "Erro: Usuário não encontrado.";
    exit;
}

$conexao->fecharConexao();
?>

<!doctype html>
<html lang="en" data-bs-theme="auto">

<head>
    <title>Perfil do Usuário</title>
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
            <h5 class="card-title">Perfil do Usuario</h5>
        </div>
        <div class="card-body">
            <?php if ($usuario['foto_perfil']) : ?>
                <img src="<?php echo $usuario['foto_perfil']; ?>" class="card-img-top img-fluid" alt="Foto de Perfil">
            <?php else : ?>
                <img src="placeholder.jpg" class="card-img-top" alt="Foto de Perfil Padrão">
            <?php endif; ?>
            <p class="card-text">Email: <?php echo $usuario['email']; ?></p>
            <p class="card-text">Privilégio: <?php echo $usuario['privilegio']; ?></p>
            <a href="javascript:history.go(-1);" class="btn btn-secondary">Voltar</a>
            <a href="editar_perfil.php" class="btn btn-primary">Editar Perfil</a>
        </div>
        <div class="card-footer text-muted">
            Status: <?php echo $usuario['status']; ?>
        </div>
    </div>


    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, se necessário -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>