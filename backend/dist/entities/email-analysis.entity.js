"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAnalysis = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let EmailAnalysis = class EmailAnalysis {
};
exports.EmailAnalysis = EmailAnalysis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmailAnalysis.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], EmailAnalysis.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'email_content' }),
    __metadata("design:type", String)
], EmailAnalysis.prototype, "emailContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'email_subject' }),
    __metadata("design:type", String)
], EmailAnalysis.prototype, "emailSubject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'email_sender' }),
    __metadata("design:type", String)
], EmailAnalysis.prototype, "emailSender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'analysis_result' }),
    __metadata("design:type", Object)
], EmailAnalysis.prototype, "analysisResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, name: 'risk_score' }),
    __metadata("design:type", Number)
], EmailAnalysis.prototype, "riskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_scam' }),
    __metadata("design:type", Boolean)
], EmailAnalysis.prototype, "isScam", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'analyzed_at' }),
    __metadata("design:type", Date)
], EmailAnalysis.prototype, "analyzedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.emailAnalyses, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], EmailAnalysis.prototype, "user", void 0);
exports.EmailAnalysis = EmailAnalysis = __decorate([
    (0, typeorm_1.Entity)('email_analyses')
], EmailAnalysis);
//# sourceMappingURL=email-analysis.entity.js.map