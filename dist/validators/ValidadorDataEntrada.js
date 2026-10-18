"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadorDataEntrada = void 0;
const Validador_1 = require("./Validador");
class ValidadorDataEntrada extends Validador_1.Validador {
    validar(data) {
        if (!(data instanceof Date)) {
            return false;
        }
        if (isNaN(data.getTime())) {
            return false;
        }
        const agora = new Date();
        if (data > agora) {
            return false;
        }
        const limite = new Date();
        limite.setDate(limite.getDate() - 90);
        if (data < limite) {
            return false;
        }
        return true;
    }
    obterMensagemErro() {
        return "A data de entrada deve estar entre hoje e os últimos 90 dias.";
    }
}
exports.ValidadorDataEntrada = ValidadorDataEntrada;
//# sourceMappingURL=ValidadorDataEntrada.js.map