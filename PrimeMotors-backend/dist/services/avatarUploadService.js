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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndUploadAvatar = validateAndUploadAvatar;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = __importStar(require("../lib/cloudinary"));
const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png"];
async function validateAndUploadAvatar(buffer) {
    const { fileTypeFromBuffer } = await import("file-type");
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !ALLOWED_MIMES.includes((type.mime || "").toLowerCase())) {
        throw new Error("Arquivo inválido. Envie apenas PNG ou JPG/JPEG.");
    }
    (0, cloudinary_1.assertCloudinaryConfigured)();
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({ folder: "avatars", resource_type: "image" }, (error, result) => (error ? reject(error) : resolve(result)));
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
    return result.secure_url;
}
//# sourceMappingURL=avatarUploadService.js.map