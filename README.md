# GreenCode

## Sistema de Gestão de Logística Reversa de Resíduos Eletrônicos

## 1. Introdução

O GreenCode é um sistema de linha de comando (CLI) desenvolvido para atuar como núcleo operacional de uma plataforma de logística reversa de resíduos eletrônicos.

O sistema tem como objetivo permitir o gerenciamento e rastreamento de organizações geradoras de resíduos, contratos de coleta, lotes, equipamentos, movimentações e informações relacionadas à destinação desses materiais.

A primeira versão do sistema será desenvolvida utilizando **Node.js e TypeScript**, com persistência de dados em arquivos de texto criptografados. O projeto também contará com mecanismos de autenticação, controle de permissões, validação de dados, auditoria, gerenciamento de sessões e registro de operações por meio de um journal.

Nesta etapa não será utilizado banco de dados nem interface gráfica. A interação com o sistema ocorrerá exclusivamente por meio do terminal.

---

# 2. Objetivos

## 2.1 Objetivo geral

Desenvolver uma aplicação CLI capaz de gerenciar o fluxo de logística reversa de equipamentos eletrônicos, garantindo segurança, rastreabilidade, integridade dos dados e controle de acesso.

## 2.2 Objetivos específicos

O sistema deverá:

* cadastrar e gerenciar organizações;
* controlar contratos de coleta;
* registrar lotes recebidos;
* cadastrar e acompanhar equipamentos;
* realizar a triagem de equipamentos;
* registrar movimentações;
* controlar usuários e seus respectivos papéis;
* controlar permissões de acesso;
* armazenar dados de forma criptografada;
* registrar operações em um journal;
* manter histórico das movimentações;
* permitir consultas de rastreabilidade;
* gerar relatórios;
* controlar sessões de usuários;
* validar dados conforme as regras de negócio estabelecidas.

---

# 3. Tecnologias utilizadas

O projeto será desenvolvido utilizando:

* **Node.js** — ambiente de execução JavaScript;
* **TypeScript** — linguagem utilizada no desenvolvimento da aplicação;
* **readline** — interação com o terminal e implementação da interface CLI;
* **Node.js Crypto** — operações de hashing e criptografia;
* **File System (fs)** — leitura e escrita dos arquivos de persistência.

Não serão utilizados:

* banco de dados;
* framework web;
* interface gráfica;
* frontend;
* servidor HTTP.

---

# 4. Arquitetura do sistema

O GreenCode será organizado em camadas, buscando separar a interface do usuário, as regras de negócio, a segurança e a persistência dos dados.

A arquitetura será composta conceitualmente pelas seguintes camadas:

```text
┌───────────────────────────────┐
│            CLI                │
│       Interface Terminal      │
├───────────────────────────────┤
│       Autenticação            │
│     Sessão e Permissões       │
├───────────────────────────────┤
│       Regras de Negócio       │
│ Organizações / Lotes / etc.  │
├───────────────────────────────┤
│       Persistência            │
│ Arquivos + Criptografia AES   │
├───────────────────────────────┤
│       Journal / Auditoria     │
├───────────────────────────────┤
│       Sistema de Arquivos     │
└───────────────────────────────┘
```

Essa organização permite que a aplicação seja posteriormente adaptada para uma interface web ou para um banco de dados relacional sem que todo o núcleo do sistema precise ser reescrito.

---

# 5. Interface de linha de comando

A interação com o sistema será realizada através do terminal.

A aplicação deverá apresentar comandos de acordo com o papel do usuário autenticado.

Os comandos seguirão uma estrutura baseada em uma ação principal seguida de parâmetros posicionais ou opcionais.

Exemplo:

```text
lote criar --org BR001 --nf 123456 --transp TransRapida
```

Nesse exemplo:

* `lote` representa o recurso;
* `criar` representa a ação;
* `--org` identifica a organização;
* `--nf` identifica a nota fiscal;
* `--transp` identifica a transportadora.

O sistema deverá apresentar mensagens de retorno após cada operação.

As mensagens deverão permitir diferenciar situações de sucesso, erro e outras ocorrências relevantes.

---

# 6. Controle de usuários

O sistema possuirá quatro papéis funcionais:

## 6.1 Administrador

Responsável por:

* gerenciar contas de acesso;
* configurar parâmetros globais;
* definir informações como alíquotas de impostos;
* configurar coeficientes de depreciação.

## 6.2 Operador de cadastro

Responsável por:

* cadastrar organizações;
* cadastrar contratos de coleta.

## 6.3 Gestor de almoxarifado

Responsável por:

* registrar chegada de lotes;
* realizar triagem;
* cadastrar equipamentos;
* realizar movimentações permitidas;
* associar códigos internos aos equipamentos.

## 6.4 Auditor

Responsável por:

* consultar históricos;
* consultar informações de rastreabilidade;
* gerar relatórios.

O auditor não possuirá permissão para alterar os dados do sistema.

---

# 7. Autenticação

O sistema deverá possuir autenticação por credenciais.

Cada usuário possuirá uma senha que não será armazenada diretamente.

As senhas serão processadas utilizando o algoritmo de hash **SHA-256**, conforme especificado na atividade.

O sistema também deverá controlar sessões de usuário.

Uma sessão deverá expirar após **30 minutos de inatividade**.

Após a expiração, o usuário deverá realizar uma nova autenticação para continuar utilizando operações protegidas.

---

# 8. Provisionamento inicial

Na inicialização, o sistema deverá verificar a existência do arquivo de configuração mestre.

Esse arquivo deverá conter informações necessárias para inicializar o sistema, incluindo:

* chave criptográfica mestre;
* informações do primeiro administrador.

Caso o arquivo não exista, o sistema deverá entrar em modo de provisionamento inicial.

Durante esse processo:

1. o sistema solicita a senha do administrador;
2. a senha é processada de acordo com a política de segurança;
3. uma chave criptográfica é gerada automaticamente;
4. o arquivo de configuração mestre é criado;
5. o sistema fica disponível para utilização.

---

# 9. Persistência dos dados

Os dados serão persistidos em arquivos, não em banco de dados.

As informações persistidas incluem dados relacionados a:

* usuários;
* organizações;
* contratos;
* lotes;
* equipamentos;
* movimentações;
* demais informações necessárias ao funcionamento do sistema.

Os arquivos deverão ser armazenados de forma criptografada utilizando **AES-256**.

A aplicação deverá realizar a descriptografia somente quando os dados forem necessários para processamento.

---

# 10. Criptografia

A criptografia dos arquivos será realizada utilizando o algoritmo simétrico AES-256.

O objetivo é impedir que os dados persistidos possam ser interpretados diretamente caso os arquivos sejam acessados por terceiros.

O fluxo de armazenamento será:

```text
Objeto em memória
       ↓
Serialização
       ↓
Criptografia AES-256
       ↓
Arquivo persistido
```

Durante a leitura:

```text
Arquivo persistido
       ↓
Descriptografia
       ↓
Desserialização
       ↓
Objeto em memória
```

A chave criptográfica mestre será criada durante o provisionamento inicial e utilizada para proteger os dados persistidos.

---

# 11. Escrita atômica

As operações de escrita deverão utilizar arquivos temporários e posterior renomeação.

O processo seguirá aproximadamente:

```text
Dados atualizados
       ↓
Arquivo temporário
       ↓
Validação da escrita
       ↓
Renomeação
       ↓
Arquivo definitivo
```

Essa estratégia reduz o risco de corrupção do arquivo principal caso o processo seja interrompido durante uma operação de escrita.

---

# 12. Journal de transações

O sistema deverá possuir um mecanismo de journaling.

Antes de uma alteração definitiva no estado do sistema, a operação deverá ser registrada no journal.

Conceitualmente:

```text
Operação
   ↓
Registro no journal
   ↓
Alteração do estado
```

O journal será utilizado para:

* auditoria;
* rastreabilidade;
* identificação de operações;
* recuperação após falhas;
* análise do histórico do sistema.

O journal deverá ser mantido por no mínimo **180 dias**.

Quando o arquivo ultrapassar **10 MB**, deverá ocorrer rotação automática.

---

# 13. Validações de negócio

O sistema deverá implementar validações para garantir a consistência dos dados.

Entre as principais validações estão:

## 13.1 CNPJ

O CNPJ deverá:

* possuir formato válido;
* possuir dígitos verificadores válidos;
* não permitir duplicidade.

A validação deverá utilizar o cálculo dos dígitos verificadores conforme as regras aplicáveis ao CNPJ.

## 13.2 Data de entrada de lote

A data de entrada de um lote:

* não poderá estar no futuro;
* não poderá ser anterior a 90 dias em relação à data atual.

## 13.3 Triagem

Um equipamento não poderá ser movimentado para o status de desmonte caso ainda não tenha passado por uma triagem completa.

## 13.4 Alteração de estado físico

Quando o estado físico de um equipamento sofrer uma redução equivalente a duas categorias ou mais em relação ao estado anterior, será obrigatória uma justificativa textual.

---

# 14. Lotes

Os lotes representam conjuntos de equipamentos ou materiais recebidos pelo sistema.

Um exemplo de criação de lote é:

```text
lote criar --org BR001 --nf 123456 --transp TransRapida
```

O lote deverá estar associado a uma organização e poderá possuir informações como:

* organização responsável;
* nota fiscal;
* transportadora;
* data de entrada;
* equipamentos associados.

As informações exatas dos atributos deverão seguir a modelagem UML definida para o projeto.

---

# 15. Equipamentos

Os equipamentos representam os ativos eletrônicos recebidos pelo sistema.

O sistema deverá permitir acompanhar sua situação durante o processo de logística reversa.

Cada equipamento deverá possuir informações suficientes para permitir:

* identificação;
* associação a um lote;
* realização de triagem;
* alteração de estado;
* movimentação;
* rastreamento histórico;
* identificação do destino.

O equipamento deverá possuir um código interno, podendo utilizar um código de barras conforme definido pela modelagem do sistema.

---

# 16. Movimentações

As movimentações representam as alterações realizadas sobre os equipamentos dentro do processo de logística reversa.

Cada movimentação deverá permitir identificar o histórico do equipamento.

Uma movimentação deverá possuir informações suficientes para registrar:

* equipamento;
* estado anterior;
* novo estado;
* data;
* responsável pela operação;
* justificativa, quando necessária.

O histórico deverá permitir consultar o caminho percorrido por um equipamento desde seu recebimento até seu destino.

---

# 17. Rastreabilidade

Uma das principais funcionalidades do GreenCode será a rastreabilidade.

O sistema deverá permitir consultar o histórico de um equipamento específico.

A consulta deverá possibilitar identificar as movimentações realizadas e a evolução do equipamento ao longo do processo.

Exemplo conceitual:

```text
Equipamento EQ001

Recebido
   ↓
Triagem
   ↓
Classificado
   ↓
Desmonte
   ↓
Reciclagem
```

Cada etapa deverá possuir seu respectivo registro no histórico.

---

# 18. Controle de permissões

As operações disponíveis deverão ser determinadas pelo papel do usuário autenticado.

O sistema deverá impedir que um usuário execute uma operação para a qual não possui permissão.

Além disso, o menu deverá ocultar as opções não autorizadas.

Dessa forma, um auditor, por exemplo, deverá visualizar apenas funcionalidades relacionadas a consulta e relatórios.

---

# 19. Tratamento de erros

O sistema deverá apresentar mensagens claras quando uma operação não puder ser executada.

Os erros poderão estar relacionados a:

* dados inválidos;
* usuário não autenticado;
* sessão expirada;
* ausência de permissão;
* entidade inexistente;
* duplicidade de informações;
* violação de regra de negócio;
* falha de leitura;
* falha de escrita;
* falha de criptografia;
* inconsistência de dados.

As mensagens deverão indicar de maneira clara o motivo da falha.

---

# 20. Testes

Deverão ser desenvolvidos scripts de teste capazes de simular uma jornada completa de utilização do sistema.

A sequência mínima deverá contemplar:

```text
Provisionamento inicial
        ↓
Criação do administrador
        ↓
Login
        ↓
Cadastro de organização
        ↓
Cadastro de contrato
        ↓
Criação de lote
        ↓
Cadastro/recebimento de equipamento
        ↓
Triagem
        ↓
Múltiplas movimentações
        ↓
Consulta de rastreabilidade
```

Também deverão ser testados cenários de erro, como:

* CNPJ inválido;
* CNPJ duplicado;
* lote com data futura;
* lote com data superior a 90 dias;
* tentativa de desmontar equipamento sem triagem;
* alteração de estado físico sem justificativa;
* acesso de usuário sem permissão;
* sessão expirada;
* falha durante gravação;
* recuperação ou identificação de operações por meio do journal.

---

# 21. Segurança

A arquitetura de segurança será baseada nos seguintes mecanismos:

| Mecanismo              | Objetivo                                   |
| ---------------------- | ------------------------------------------ |
| SHA-256                | Proteção das senhas armazenadas            |
| AES-256                | Criptografia dos dados persistidos         |
| Sessão com expiração   | Redução do risco de acesso indevido        |
| Controle de permissões | Restrição das operações por papel          |
| Journal                | Auditoria das operações                    |
| Escrita atômica        | Redução do risco de corrupção dos arquivos |
| Validação de dados     | Garantia de consistência                   |

---

# 22. Estrutura conceitual do projeto

Uma possível organização inicial dos arquivos é:

```text
greencode/
│
├── src/
│   ├── cli/
│   │   ├── menu.ts
│   │   ├── commands.ts
│   │   └── prompt.ts
│   │
│   ├── models/
│   │   ├── Usuario.ts
│   │   ├── Organizacao.ts
│   │   ├── Lote.ts
│   │   ├── Equipamento.ts
│   │   └── Movimentacao.ts
│   │
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── OrganizacaoService.ts
│   │   ├── LoteService.ts
│   │   ├── EquipamentoService.ts
│   │   └── MovimentacaoService.ts
│   │
│   ├── security/
│   │   ├── crypto.ts
│   │   ├── hash.ts
│   │   └── session.ts
│   │
│   ├── persistence/
│   │   ├── fileStorage.ts
│   │   └── atomicWrite.ts
│   │
│   ├── audit/
│   │   └── journal.ts
│   │
│   ├── validation/
│   │   ├── cnpj.ts
│   │   └── validators.ts
│   │
│   └── main.ts
│
├── data/
│
├── tests/
│
├── package.json
├── tsconfig.json
└── README.md
```

Essa estrutura é uma proposta inicial. As classes e relacionamentos deverão ser ajustados de acordo com o diagrama UML fornecido para o projeto.

---

# 23. Compatibilidade

O sistema deverá ser compatível com:

* Windows 10 ou superior;
* Ubuntu 24.04.03 ou superior;
* distribuições Linux derivadas do Ubuntu.

Para garantir compatibilidade, serão utilizadas APIs disponíveis no Node.js e comandos que não dependam exclusivamente de um sistema operacional específico.

---

# 24. Evolução futura

A arquitetura deverá permitir a evolução do projeto.

Nas próximas etapas, o sistema poderá receber:

* interface web;
* banco de dados relacional;
* novos tipos de resíduos;
* novos usuários e papéis;
* novos relatórios;
* integração com sistemas externos;
* mecanismos adicionais de rastreabilidade.

A separação entre regras de negócio, persistência, segurança e interface CLI permitirá substituir gradualmente determinadas partes do sistema sem necessidade de reescrever todo o núcleo da aplicação.

---

# 25. Conclusão

O GreenCode será desenvolvido como uma aplicação CLI segura e modular para gerenciamento de logística reversa de resíduos eletrônicos.

A primeira versão terá como principais características a autenticação de usuários, controle de permissões, validação de regras de negócio, persistência criptografada em arquivos, escrita atômica, journaling, auditoria e rastreabilidade.

A escolha de Node.js com TypeScript permitirá utilizar tipagem estática e uma estrutura orientada a objetos adequada à evolução do sistema.

Nesta primeira etapa não será utilizado banco de dados ou interface gráfica. O foco estará na construção de um núcleo operacional robusto que poderá posteriormente ser integrado a uma aplicação web e a um banco de dados relacional.
