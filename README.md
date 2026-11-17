# Nemon — Bot de Presenças para Discord

Bot Discord para gerenciar presenças em eventos com ranking por categoria.

## Configuração

### 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=id_da_aplicacao
GUILD_ID=id_do_servidor
```

> **Nunca compartilhe o arquivo `.env` publicamente.**

### 2. Instalar dependências

```bash
npm install
```

### 3. Registrar os comandos no servidor

```bash
npm run deploy
```

### 4. Iniciar o bot

```bash
npm start
```

Ao iniciar, o bot cria automaticamente o cargo **Nobre** no servidor caso ele ainda não exista. Esse cargo é necessário para usar o `/painel-admin`.

---

## Comandos

### Membros

| Comando | Descrição |
|---|---|
| `/presenca evento_id:<id>` | Confirma sua presença em um evento aberto |
| `/remover-presenca evento_id:<id>` | Remove sua presença de um evento ainda aberto |
| `/meu-historico` | Exibe seu histórico de presenças com total e breakdown por categoria |
| `/meu-historico membro:<@user>` | Exibe o histórico de outro membro (requer permissão Gerenciar Eventos) |
| `/meu-historico categoria:<nome>` | Filtra o histórico por categoria |
| `/ranking` | Exibe o ranking geral de presenças (top 10 por padrão) |
| `/ranking categoria:<nome>` | Ranking filtrado por categoria |
| `/ranking top:<n>` | Define quantos membros mostrar (1–50) |
| `/evento-listar` | Lista os eventos abertos no momento |
| `/evento-listar todos:true` | Lista todos os eventos, incluindo encerrados |
| `/categorias` | Lista todas as categorias com estatísticas de eventos e presenças |

### Administração (requer permissão **Gerenciar Eventos**)

| Comando | Descrição |
|---|---|
| `/evento-criar nome:<nome> data:<DD/MM/AAAA> hora:<HH:MM>` | Cria um novo evento e abre o painel de presença no canal |
| `/evento-criar ... descricao:<texto>` | Cria um evento com descrição opcional |
| `/evento-fechar id:<id>` | Fecha um evento, encerrando o registro de presenças |
| `/presenca-admin add evento_id:<id> membro:<@user>` | Marca presença de um membro manualmente |
| `/presenca-admin remover evento_id:<id> membro:<@user>` | Remove a presença de um membro manualmente |
| `/presenca-listar evento_id:<id>` | Lista todos os presentes em um evento |
| `/categoria-criar nome:<nome>` | Cria uma nova categoria de eventos |
| `/categoria-criar nome:<nome> descricao:<texto>` | Cria uma categoria com descrição |

### Painel admin (requer cargo **Nobre**)

| Comando | Descrição |
|---|---|
| `/painel-admin evento_id:<id>` | Abre um painel com botões para adicionar ou remover membros de um evento em massa |

---

## Fluxo típico de uso

1. Um admin cria uma categoria com `/categoria-criar nome:Treino`.
2. Um admin cria um evento com `/evento-criar nome:"Treino Semanal" data:20/11/2026 hora:20:00`. O bot pede a categoria e posta um embed no canal com o botão de confirmar presença.
3. Os membros clicam no botão do embed **ou** usam `/presenca evento_id:<id>` para confirmar presença.
4. Ao final, o admin fecha o evento com `/evento-fechar id:<id>`.
5. Use `/ranking` ou `/meu-historico` para acompanhar as estatísticas.

---

## Requisitos

- Node.js 18 ou superior
- Token de bot Discord com as permissões: **Manage Roles**, **Send Messages**, **Read Message History**, **Use Application Commands**
- Intent `Guilds` habilitada no painel do desenvolvedor
