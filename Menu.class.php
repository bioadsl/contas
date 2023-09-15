<?php
class Menu {
    public static function render() {
        echo '

            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Alterna navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-center" id="navbarTogglerDemo01">
                    <a class="navbar-brand" href="admin_area.php">Admin</a>
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">

                        <li class="nav-item active">
                            <a class="nav-link" href="admin_area.php">Home <span class="sr-only">(Página atual)</span></a>
                        </li>
                
                        <li class="nav-item">
                            <a class="nav-link" href="atualizacao_contas.php">Atualização de Contas</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="cadastro_contas.php">Cadastro de Contas</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="consulta_contas.php">Consulta de Contas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="consulta_usuario.php">Consulta Usuarios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="perfil_usuario.php">Perfil do Usuario</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="logout.php">Logout</a>
                        </li>


                    </ul>

                </div>
            </nav>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
            <script>window.jQuery || document.write("<script src="../../assets/js/vendor/jquery.min.js"><\/script>)</script>
            <script src="js/bootstrap.min.js"></script>
            
            
            
            ';
        }
    }
?>