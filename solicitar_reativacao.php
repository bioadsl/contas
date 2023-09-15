<!DOCTYPE html>
<html>
<head>
    <title>Solicitação de Reativação de Conta</title>
    <meta charset="UTF-8">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Solicitação de Reativação de Conta</div>
                    <div class="card-body">
                        <form action="enviar_solicitacao.php" method="post">
                            <div class="form-group">
                                <label for="nome">Nome:</label>
                                <input type="text" class="form-control" id="nome" name="nome" required>
                            </div>

                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" class="form-control" id="email" name="email" required>
                            </div>
                            <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
                            <button type="submit" class="btn btn-primary">Enviar Solicitação</button>
                        </form>
                    </div>
                </div>
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
