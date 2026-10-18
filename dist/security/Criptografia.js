"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Criptografia = void 0;
const crypto = __importStar(require("crypto"));
class Criptografia {
    constructor() {
        this.algoritmo = "aes-256-gcm";
        this.tamanhoChave = 32;
        this.tamanhoIv = 16;
        this.aad = "GreenCode";
    }
    criptografar(texto, chave) {
        this.validarChave(chave);
        const iv = crypto.randomBytes(this.tamanhoIv);
        const cipher = crypto.createCipheriv(this.algoritmo, chave, iv);
        cipher.setAAD(Buffer.from(this.aad));
        const criptografado = Buffer.concat([
            cipher.update(texto, "utf8"),
            cipher.final()
        ]);
        const tag = cipher.getAuthTag();
        return [
            iv.toString("base64"),
            tag.toString("base64"),
            criptografado.toString("base64")
        ].join(":");
    }
    descriptografar(textoCriptografado, chave) {
        this.validarChave(chave);
        const partes = textoCriptografado.split(":");
        if (partes.length !== 3) {
            throw new Error("Conteúdo criptografado inválido.");
        }
        const iv = Buffer.from(partes[0], "base64");
        const tag = Buffer.from(partes[1], "base64");
        const criptografado = Buffer.from(partes[2], "base64");
        const decipher = crypto.createDecipheriv(this.algoritmo, chave, iv);
        decipher.setAAD(Buffer.from(this.aad));
        decipher.setAuthTag(tag);
        const texto = Buffer.concat([
            decipher.update(criptografado),
            decipher.final()
        ]);
        return texto.toString("utf8");
    }
    gerarChave() {
        return crypto.randomBytes(this.tamanhoChave);
    }
    validarChave(chave) {
        if (!Buffer.isBuffer(chave) ||
            chave.length !== this.tamanhoChave) {
            throw new Error("A chave de criptografia deve possuir 32 bytes.");
        }
    }
}
exports.Criptografia = Criptografia;
//# sourceMappingURL=Criptografia.js.map