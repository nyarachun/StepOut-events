const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/events';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoibHVjYXMub3JnYW5pemVyQHN0ZXBvdXQuZGV2Iiwicm9sZSI6Im9yZ2FuaXplciIsImlhdCI6MTc4OTA2NzY1MywiZXhwIjoxNzg5MDg1NjUzfQ.I8A2FVGaEnPy_fSkphXdAIUSjn3hejcPwtTuC3-dHVs'; // Якщо є AuthGuard, встав сюди Bearer токен без слова 'Bearer'

async function run() {
  const filePath = path.join(__dirname, 'events.json');

  if (!fs.existsSync(filePath)) {
    console.error('❌ Файл events.json не знайдено!');
    return;
  }

  const fileData = fs.readFileSync(filePath, 'utf-8');
  const events = JSON.parse(fileData);

  console.log(`📦 Знайдено ${events.length} івентів у файлі. Починаємо імпорт...`);

  const headers = { 'Content-Type': 'application/json' };
  if (JWT_TOKEN) {
    headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < events.length; i++) {
    const item = events[i];

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(item)
      });

      if (res.ok) {
        console.log(`✅ [${i + 1}/${events.length}] Додано: "${item.title}"`);
        success++;
      } else {
        const err = await res.text();
        console.error(`❌ [${i + 1}/${events.length}] Помилка: ${res.status} — ${err}`);
        failed++;
      }
    } catch (e) {
      console.error(`💥 [${i + 1}/${events.length}] Помилка з'єднання: ${e.message}`);
      failed++;
    }

    // 50мс пауза, щоб спокійно проходили транзакції в БД
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log(`\n🎉 Готово! Успішно створено: ${success}, впало: ${failed}`);
}

run();