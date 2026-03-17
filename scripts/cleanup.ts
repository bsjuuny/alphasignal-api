import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DB 데이터 정제 및 중복 정리 시작 ---');

  // 무의미한 종목코드 정제
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

  const seen = new Set<string>();
  const toDelete: string[] = [];

  for (const signal of allSignals) {
    // 중복 기준: 종목코드(symbol) + 시그널(action) + 같은 시간대(1시간 단위)
    // 1시간 단위로 버림 처리해서 그룹화
    const date = new Date(signal.createdAt);
    date.setMinutes(0, 0, 0); // 정시 단위로 그룹화
    const key = `${signal.symbol}-${signal.action}-${date.toISOString()}`;

    if (seen.has(key)) {
      toDelete.push(signal.id);
    } else {
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
  } else {
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
