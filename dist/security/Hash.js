"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Hash {
    static gerarSalt() {
        return crypto_1.default
            .randomBytes(Hash.TAMANHO_SALT)
            .toString("hex");
    }
    static gerar(senha, salt) {
        return crypto_1.default
            .createHash("sha256")
            .update(senha + salt)
            .digest("hex");
    }
    static verificar(senha, hash, salt) {
        const novoHash = Hash.gerar(senha, salt);
        return crypto_1.default.timingSafeEqual(Buffer.from(novoHash, "hex"), Buffer.from(hash, "hex"));
    }
}
exports.Hash = Hash;
Hash.TAMANHO_SALT = 16;
//# sourceMappingURL=Hash.js.map