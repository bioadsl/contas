<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

// Verificar se o ID do usuário a ser editado foi fornecido na URL
if (!isset($_GET['id'])) {
    header("Location: consultar_usuarios.php"); // Redirecionar para a página de consulta de usuários se o ID não for fornecido
    exit;
}

$usuario_id = $_GET['id'];

// Buscar informações do usuário no banco de dados
$conexao = new Conn();
$mysqli = $conexao->getConexao();
$consulta = "SELECT id, nome, email status, foto_perfil FROM usuarios WHERE id = $usuario_id";
$resultado = $mysqli->query($consulta);

// Verificar se o usuário foi encontrado
if ($resultado && $resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
} else {
    // Se o usuário não for encontrado, redirecionar para a página de consulta de usuários
    header("Location: user_area.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Editar Usuário</title>
    <meta charset="UTF-8">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">

    <div class="card w-75">
  <div class="card-body">
    <h5 class="card-title">Editar Usuário</h5>

        <div class="row">
            <div class="col-md-6" style="text-align: center; vertical-align: middle;line-height: 90px;">
                <img src="Assets/uploads/<?php echo $usuario['foto_perfil']; ?>" alt="Foto de Perfil"  width="100%"  class="img-fluid">
            </div>
            <div class="col-md-6">
                <form action="editar_usuario_backend.php" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="nome">Nome:</label>
                        <input type="text" class="form-control" id="nome" name="nome" required value="<?php echo $usuario['nome']; ?>">
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" class="form-control" id="email" name="email" required value="<?php echo $usuario['email']; ?>">
                    </div>
                    <div class="form-group">
                        <label for="senha">Senha:</label>
                        <input type="password" class="form-control" id="senha" name="senha">
                    </div>           
                    <div class="form-group">
                        <label for="status">Status:</label>
                        <select class="form-control" id="status" name="status" required>
                            <option value="ativo" <?php if ($usuario['status'] === 'ativo') echo 'selected'; ?>>Ativo</option>
                            <option value="inativo" <?php if ($usuario['status'] === 'inativo') echo 'selected'; ?>>Inativo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="foto_perfil">Nova Foto de Perfil:</label>
                        <input type="file" class="form-control-file" id="foto_perfil" name="foto_perfil" accept=".jpg, .jpeg, .png">
                    </div>                
            </div>     
                <div class="col-md-12" style="text-align: center; vertical-align: middle;line-height: 90px;">
                    <hr>
                        <input type="hidden" name="id" value="<?php echo $usuario_id; ?>">
                        <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
                        <button type="submit" class="btn btn-primary ">Salvar</button>                    
                </div>
                    
                </form>
          
         
        </div>
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


