"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const email_controller_1 = require("./controllers/email.controller");
const chat_controller_1 = require("./controllers/chat.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const ai_service_1 = require("./services/ai.service");
const auth_service_1 = require("./services/auth.service");
const user_service_1 = require("./services/user.service");
const email_analysis_service_1 = require("./services/email-analysis.service");
const chat_service_1 = require("./services/chat.service");
const database_config_1 = require("./config/database.config");
const user_entity_1 = require("./entities/user.entity");
const email_analysis_entity_1 = require("./entities/email-analysis.entity");
const chat_session_entity_1 = require("./entities/chat-session.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.databaseConfig),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, email_analysis_entity_1.EmailAnalysis, chat_session_entity_1.ChatSession, chat_message_entity_1.ChatMessage]),
        ],
        controllers: [
            app_controller_1.AppController,
            email_controller_1.EmailController,
            chat_controller_1.ChatController,
            auth_controller_1.AuthController
        ],
        providers: [
            app_service_1.AppService,
            ai_service_1.AiService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            email_analysis_service_1.EmailAnalysisService,
            chat_service_1.ChatService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map