# Excel Processor

## Descrição
Excel Processor é uma aplicação web desenvolvida com React e TypeScript que permite aos usuários carregar, gerenciar e pesquisar dados em arquivos Excel de forma eficiente e intuitiva.

## Funcionalidades Principais
### 1. Gerenciamento de Arquivos Excel
- **Upload de Arquivos:** Os usuários podem fazer upload de arquivos Excel (.xlsx, .xls).
- **Listagem de Arquivos:** Exibe todos os arquivos Excel carregados.
- **Ativação de Arquivo:** Permite selecionar um arquivo específico para processamento.
- **Desativação de Arquivo:** Opção para parar o uso do arquivo atual.
- **Exclusão de Arquivos:** Remove arquivos da lista e do armazenamento.

### 2. Processamento de Dados
- **Leitura de Arquivos Excel:** Utiliza a biblioteca ExcelJS para ler e processar arquivos Excel.
- **Extração de Cabeçalhos:** Identifica automaticamente os cabeçalhos das colunas.
- **Armazenamento de Dados:** Salva os dados processados para uso rápido.

### 3. Funcionalidade de Busca
- **Seleção de Coluna:** Permite escolher uma coluna específica para realizar a busca.
- **Múltiplos Valores de Busca:** Suporta a entrada de múltiplos valores para busca.
- **Busca Exata:** Realiza uma busca case-insensitive por correspondências exatas.
- **Exibição de Resultados:** Mostra os resultados da busca em uma tabela formatada.

### 4. Interface de Usuário
- **Design Responsivo:** Interface amigável e responsiva usando TailwindCSS.
- **Feedback Visual:** Destaque para o arquivo atualmente ativo.
- **Tabela de Resultados:** Exibe os resultados da busca com suporte a scroll para grandes conjuntos de dados.

### 5. Persistência de Dados
- **Armazenamento Local:** Utiliza o localStorage para salvar arquivos e configurações.
- **Recuperação de Sessão:** Recarrega o estado anterior ao reabrir a aplicação.

## Tecnologias Utilizadas
- React
- TypeScript
- ExcelJS
- TailwindCSS
- Vite (para build e desenvolvimento)

## Como Usar
1. Faça o upload de um arquivo Excel.
2. Selecione o arquivo na lista para ativá-lo.
3. Escolha uma coluna para realizar a busca.
4. Insira os valores de busca (um por linha).
5. Clique em "Search" para ver os resultados.

## Licença
Este projeto está licenciado sob a MIT.