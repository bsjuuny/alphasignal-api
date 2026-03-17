"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- DB 데이터 정제 및 중복 정리 시작 ---');
    const badSymbols = ['코드 없음', 'null', 'undefined', 'null '];
    const updateCount = await prisma.signal.updateMany({
        where: {
            symbol: { in: badSymbols },
        },
        data: {
            symbol: null,
        },
    });
    if (updateCount.count > 0) {
        console.log(`${updateCount.count}개의 무의미한 종목코드를 null로 변경했습니다.`);
    }
    const allSignals = await prisma.signal.findMany({
        orderBy: { createdAt: 'desc' },
    });
    const seen = new Set();
    const toDelete = [];
    for (const signal of allSignals) {
        const date = new Date(signal.createdAt);
        date.setMinutes(0, 0, 0);
        const key = `${signal.symbol}-${signal.action}-${date.toISOString()}`;
        if (seen.has(key)) {
            toDelete.push(signal.id);
        }
        else {
            seen.add(key);
        }
    }
    if (toDelete.length > 0) {
        console.log(`${toDelete.length}개의 중복 시그널을 삭제합니다...`);
        await prisma.signal.deleteMany({
            where: {
                id: { in: toDelete },
            },
        });
        console.log('삭제 완료!');
    }
    else {
        console.log('삭제할 중복 데이터가 없습니다.');
    }
    console.log('--- 정리 종료 ---');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=cleanup.js.map