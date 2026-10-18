"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const PapelUsuario_1 = require("../enums/PapelUsuario");
class Menu {
    exibir(papel) {
        console.log("\n==============================\n          GREENCODE\n==============================");
        console.log(`Perfil: ${papel}\n`);
        const menus = {
            [PapelUsuario_1.PapelUsuario.ADMINISTRADOR]: ["organização criar", "organização listar", "contrato criar", "contrato listar", "contrato renovar", "contrato encerrar", "lote criar", "lote listar", "equipamento cadastrar", "equipamento listar", "equipamento estado", "movimentação registrar", "movimentação listar", "usuário criar", "usuário listar", "configuração atualizar", "configuração listar", "relatório"],
            [PapelUsuario_1.PapelUsuario.OPERADOR_CADASTRO]: ["organização criar", "organização listar", "contrato criar", "contrato listar", "contrato renovar", "contrato encerrar"],
            [PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO]: ["lote criar", "lote listar", "equipamento cadastrar", "equipamento listar", "equipamento estado", "movimentação registrar", "movimentação listar"],
            [PapelUsuario_1.PapelUsuario.AUDITOR]: ["organização listar", "contrato listar", "lote listar", "equipamento listar", "movimentação listar", "configuração listar", "relatório"]
        };
        (menus[papel] ?? []).forEach(item => console.log(item));
        console.log("\nDigite 'menu' para exibir novamente.\nDigite 'sair' para encerrar.\n");
    }
}
exports.Menu = Menu;
//# sourceMappingURL=Menu.js.map