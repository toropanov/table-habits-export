import fs from 'fs';

const TABLE_HABIT_BACKUP_PATH = 'data.json';
const DIARY_PATH = '~/Yandex.Disk.localized/Obsidian/Diary/Data';

try {
  const jsonData = fs.readFileSync(TABLE_HABIT_BACKUP_PATH, 'utf8');
  const { habits } = JSON.parse(jsonData);

  habits.forEach(({ records, name }) => {
    records.forEach(({ create_t, record_value }) => {
      const date = new Date(create_t * 1000);
      const day = String(date.getDate() + 1).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      const relativePath = `${year}/${month}/${day}.md`;
      // const absolutePath = `${DIARY_PATH}/${relativePath}`;
      const absolutePath = '/Users/tanotify/Yandex.Disk.localized/Obsidian/Diary/Data/2024/03/15.md';

      const isCompleted = record_value === 1 ? true : false;

      fs.readFile(absolutePath, 'utf8', (err, content) => {
        let data = content || '';
    
        if (!data.startsWith('---')) {
          data = '---\n\n---\n' + data;
        }

        const regex = new RegExp(`---.*${name}.*---`);

        if (!regex.test(data)) {
          console.log({ name, data })
          data = data.replace(/^---/, `$&\n${name}: ${isCompleted}`);
        }
      
        fs.writeFile(absolutePath, data, 'utf8', err => {
          if (err) return;
          // console.log('Written successfully!')
        });
      });
      // console.log({ relativePath, date, isCompleted });
    });
  });
  // console.log(data);
} catch (err) {
  console.error('Error reading file:', err);
}
