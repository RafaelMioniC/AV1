"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserComando = void 0;
class ParserComando {
    interpretar(entrada) {
        const partes = this.tokenizar(entrada);
        const recurso = partes[0] ?? "";
        const acao = partes[1] ?? "";
        const parametros = {};
        const posicionais = [];
        for (let i = 2; i < partes.length; i++) {
            const parte = partes[i];
            if (!parte.startsWith("--")) {
                posicionais.push(parte);
                continue;
            }
            const nome = parte.substring(2);
            const proximo = partes[i + 1];
            if (proximo && !proximo.startsWith("--")) {
                parametros[nome] = proximo;
                i++;
            }
            else {
                parametros[nome] = "true";
            }
        }
        return { recurso, acao, parametros, posicionais };
    }
    tokenizar(entrada) {
        const resultado = [];
        const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'|(\S+)/g;
        let correspondencia;
        while ((correspondencia = regex.exec(entrada)) !== null) {
            resultado.push(correspondencia[1] ?? correspondencia[2] ?? correspondencia[3]);
        }
        return resultado;
    }
}
exports.ParserComando = ParserComando;
//# sourceMappingURL=ParserComando.js.map