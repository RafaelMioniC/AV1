# GreenCode — edição e exclusão de cadastros

A estrutura original do projeto foi mantida. Os comandos novos aceitam parâmetros `--campo valor`. Use `menu` para ver as opções permitidas para seu perfil.

## Exemplos

```text
organização editar --id ORG-1 --nome "Novo nome" --telefone "11999999999"
organização excluir --id ORG-1

contrato editar --id CONT-1 --descricao "Contrato atualizado" --valor 1500 --fim 2027-12-31
contrato excluir --id CONT-1

lote editar --id LOTE-1 --nf NF-123 --transp "Transportadora nova" --obs "Observação atualizada"
lote excluir --id LOTE-1

equipamento editar --id EQ-1 --marca "Dell" --modelo "Latitude" --ano 2023 --peso 2.1 --local "Estoque A"
equipamento excluir --id EQ-1

usuario editar --usuario operador --senha "novaSenha123" --papel OPERADOR_CADASTRO
usuario excluir --usuario operador\n\nmovimentação editar --id EQ-1-123456 --status TRIAGEM_CONCLUIDA --justificativa "Correção do status"\nmovimentação excluir --id EQ-1-123456
```

Informe somente os campos que deseja alterar. Para datas, use `AAAA-MM-DD` ou `DD/MM/AAAA`. Os IDs e nomes de usuários são informados como aparecem nos comandos de listagem.

## Regras de segurança

- Não é permitido excluir o usuário administrador.
- Não é permitido excluir lotes que ainda possuam equipamentos.
- Não é permitido excluir organizações vinculadas a contratos ou lotes.
- Excluir equipamento também remove sua referência no lote.
- Todas as edições e exclusões são registradas no journal de auditoria.
- Movimentações também podem ser editadas ou excluídas; essas ações ficam registradas no journal de auditoria. Ao excluir uma movimentação, o status do equipamento é recalculado pela última movimentação restante.

## Executar

```bash
npm install
npm run dev
```

O comando `npm start` compila o TypeScript antes de iniciar.
