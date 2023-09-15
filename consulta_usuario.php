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
    <title>Consulta de Usuários</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Adicione o link para o CSS do DataTables para estilos de tabela aprimorados -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"> <!-- Adicione o link para a biblioteca Font Awesome -->

    <style>

            .coluna {
                vertical-align: middle;
                align: center;
                text-align: center;
               
            }

    </style>

</head>
<body>

<?php
    require_once 'Menu.class.php';
    Menu::render();
    ?>

<!-- <div class="container mt-5"> -->
<div class="container-fluid">
        <h2>Consulta de Usuários</h2>
        <table id="usuariosTable" class="table table-bordered">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Privilégio</th>
                    <th>Status</th> <!-- Adicionado o campo de status -->
                    <th>Foto de Perfil</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>

                <?php
                    require_once 'Conn.php';

                    $conexao = new Conn();
                    $mysqli = $conexao->getConexao();

                    $consulta = "SELECT id, nome, email, privilegio, status, foto_perfil FROM usuarios";
                    $resultado = $mysqli->query($consulta);

                    if ($resultado && $resultado->num_rows > 0) {
                        while ($usuario = $resultado->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td><img class='img-fluid' src='{$usuario['foto_perfil']}' alt='Foto de Perfil' width='30'></td>";
                            echo "<td class='coluna'>{$usuario['nome']}</td>";
                            echo "<td>{$usuario['email']}</td>";
                            echo "<td>{$usuario['privilegio']}</td>";
                            echo "<td>{$usuario['status']}</td>"; // Exibe o status
                            echo "<td>";
                            echo "<a href='editar_usuario_adm.php?id={$usuario['id']}' class='btn  btn-icon btn-sm'><i class='fas fa-edit'></i></a> ";
                            echo "<a href='deletar_usuario.php?id={$usuario['id']}' class='btn  btn-sm'><i class='fas fa-trash-alt btn  btn-sm'></i></a> ";
                            echo "<a href='inativar_usuario.php?id={$usuario['id']}' class='btn  btn-sm'><i class='fas fa-ban btn  btn-sm'></i></a>";
                            echo "</td>";
                            echo "</tr>";
                        }
                    } else {
                        echo "<tr><td colspan='6'>Nenhum usuário encontrado.</td></tr>";
                    }

                    $conexao->fecharConexao();
                ?>

            </tbody>
        </table>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap e do DataTables -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#usuariosTable').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/Portuguese-Brasil.json" // Configuração de idioma para português Brasil
                },
                "paging": true, // Ativação da paginação
                "ordering": true, // Ativação da ordenação
                "searching": true, // Ativação da pesquisa
                "info": true // Exibição de informações de tabela (total de registros, página atual etc.)
            });
        });
    </script>
</body>
</html>
