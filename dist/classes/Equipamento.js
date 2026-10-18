"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipamento = void 0;
const EstadoFisico_1 = require("../enums/EstadoFisico");
const StatusEquipamento_1 = require("../enums/StatusEquipamento");
class Equipamento {
    constructor(id, codigoBarrasInterno, tipo, marca, modelo, anoFabricacao, estadoFisico, dataEntrada, local, peso) {
        this.id = id;
        this.codigoBarrasInterno = codigoBarrasInterno;
        this.tipo = tipo;
        this.marca = marca;
        this.modelo = modelo;
        this.anoFabricacao = anoFabricacao;
        this.estadoFisico = estadoFisico;
        this.dataEntrada = dataEntrada;
        this.local = local;
        this.peso = peso;
        this.status = StatusEquipamento_1.StatusEquipamento.RECEBIDO;
    }
    atualizarEstadoFisico(novoEstado, justificativa) {
        const nivelEstado = {
            [EstadoFisico_1.EstadoFisico.NOVO]: 7,
            [EstadoFisico_1.EstadoFisico.BOM_ESTADO]: 6,
            [EstadoFisico_1.EstadoFisico.USADO_LEVE]: 5,
            [EstadoFisico_1.EstadoFisico.USADO_MODERADO]: 4,
            [EstadoFisico_1.EstadoFisico.DANIFICADO_LEVE]: 3,
            [EstadoFisico_1.EstadoFisico.DANIFICADO_GRAVE]: 2,
            [EstadoFisico_1.EstadoFisico.IRRECUPERAVEL]: 1
        };
        const estadoAtual = nivelEstado[this.estadoFisico];
        const estadoNovo = nivelEstado[novoEstado];
        const queda = estadoAtual - estadoNovo;
        if (queda >= 2 && !justificativa?.trim()) {
            throw new Error("É obrigatória uma justificativa quando o estado físico cair duas ou mais categorias.");
        }
        this.estadoFisico = novoEstado;
    }
}
exports.Equipamento = Equipamento;
//# sourceMappingURL=Equipamento.js.map