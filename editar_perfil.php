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
$consulta = "SELECT id, nome, email, foto_perfil FROM usuarios WHERE id = $usuario_id";
$resultado = $mysqli->query($consulta);

if ($resultado && $resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
} else {
    echo "Erro: Usuário não encontrado.";
    exit;
}

$conexao->fecharConexao();

// Tratamento do formulário de edição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $novo_nome = $_POST['nome'];
    $novo_email = $_POST['email'];

    // Verificar se foi feito o upload de uma nova foto de perfil
    if (isset($_FILES['nova_foto']) && $_FILES['nova_foto']['error'] === UPLOAD_ERR_OK) {
        $nome_arquivo = $_FILES['nova_foto']['name'];
        $caminho_temporario = $_FILES['nova_foto']['tmp_name'];
        $extensao = pathinfo($nome_arquivo, PATHINFO_EXTENSION);

        // Gerar um nome único para a imagem
        $nome_imagem = uniqid() . ".$extensao";

        // Mover a imagem para o diretório de uploads
        move_uploaded_file($caminho_temporario, "Assets/uploads/$nome_imagem");

        // Atualizar o nome da imagem no banco de dados
        $conexao = new Conn();
        $mysqli = $conexao->getConexao();

        $atualizacao = "UPDATE usuarios SET nome = '$novo_nome', email = '$novo_email', foto_perfil = '$nome_imagem' WHERE id = $usuario_id";

        if ($mysqli->query($atualizacao)) {
            // Atualização bem-sucedida
            header("Location: perfil_usuario.php");
            exit;
        } else {
            echo "Erro ao atualizar o perfil: " . $mysqli->error;
        }

        $conexao->fecharConexao();
    } else {
        // Não houve upload de nova imagem, apenas atualizar nome e email
        $conexao = new Conn();
        $mysqli = $conexao->getConexao();

        $atualizacao = "UPDATE usuarios SET nome = '$novo_nome', email = '$novo_email' WHERE id = $usuario_id";

        if ($mysqli->query($atualizacao)) {
            // Atualização bem-sucedida
            header("Location: user_area.php");
            exit;
        } else {
            echo "Erro ao atualizar o perfil: " . $mysqli->error;
        }

        $conexao->fecharConexao();
    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Editar Perfil</title>
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
</head>

<body>
    <div class="card text-center">
        <div class="card-header">
            <h5 class="card-title">Editar Perfil</h5>
        </div>
        <div class="card-body">
            <form action="" method="post" enctype="multipart/form-data">
                <?php if ($usuario['foto_perfil']) : ?>
                    <img src="<?php echo $usuario['foto_perfil']; ?>" class="card-img-top" alt="Foto de Perfil">
                <?php else : ?>
                    <img src="placeholder.jpg" class="card-img-top" alt="Foto de Perfil Padrão">
                <?php endif; ?>
                <div class="card-body">

                    <p class="card-text"> <label for="nome">Nome:</label>
                        <input type="text" class="form-control" id="nome" name="nome" value="<?php echo $usuario['nome']; ?>" required>
                    </p>


                    <p class="card-text"> <label for="email">Email:</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?php echo $usuario['email']; ?>" required>
                    </p>

                    <p class="card-text">
                        <label for="nova_foto">Nova Foto de Perfil:</label>
                        <input type="file" class="form-control-file" id="nova_foto" name="nova_foto">
                    </p>

                    <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>               
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