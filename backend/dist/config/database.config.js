"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const email_analysis_entity_1 = require("../entities/email-analysis.entity");
const chat_session_entity_1 = require("../entities/chat-session.entity");
const chat_message_entity_1 = require("../entities/chat-message.entity");
exports.databaseConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_DATABASE || 'gmail_scam_analyzer',
    entities: [user_entity_1.User, email_analysis_entity_1.EmailAnalysis, chat_session_entity_1.ChatSession, chat_message_entity_1.ChatMessage],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    retryAttempts: 3,
    retryDelay: 3000,
};
//# sourceMappingURL=database.config.js.map