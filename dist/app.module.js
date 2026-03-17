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
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const collector_module_1 = require("./modules/collector/collector.module");
const analyzer_module_1 = require("./modules/analyzer/analyzer.module");
const signal_module_1 = require("./modules/signal/signal.module");
const theme_module_1 = require("./modules/theme/theme.module");
const market_module_1 = require("./modules/market/market.module");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const news_module_1 = require("./modules/news/news.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            collector_module_1.CollectorModule,
            analyzer_module_1.AnalyzerModule,
            signal_module_1.SignalModule,
            theme_module_1.ThemeModule,
            market_module_1.MarketModule,
            prisma_module_1.PrismaModule,
            news_module_1.NewsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map