import fs from 'fs';
import util from 'util';

const TABLE_HABIT_BACKUP_PATH = 'data.json';
const DIARY_PATH = '../../Yandex.Disk.localized/Obsidian/Diary/Data';

const PROPERTIES_BY_PATH = {};

const jsonData = fs.readFileSync(TABLE_HABIT_BACKUP_PATH, 'utf8');
const { habits } = JSON.parse(jsonData);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

async function readFileIfExists(filename) {
  try {
    return await readFile(filename, 'utf8');
  } catch (error) {
    return await '';
  }
}

async function writePropertiesToFile(path, newProperties) {
  try {
    const absolutePath = `${DIARY_PATH}/${path}`;
    const data = await readFileIfExists(absolutePath);

    const regex = /^---(.*?)^---/gms;
    const existingProperties = Array.from(data.matchAll(regex), m => m[1].trim().split('\n'))[0]?.reduce((prev, line) => {
      const [key, value] = line.split(': ');
      return { ...prev, [key]: value };
    }, {}) || {};

    const properties = { ...existingProperties, ...newProperties };

    const parts = data.split('---');
    const lastIndex = parts.length - 1;
    const text = parts[lastIndex].trim();

    const stringifiedProperties = Object.keys(properties).reduce((acc, property) => {
      return acc + `${property}: ${properties[property]}\n`;
    }, '');

    const updatedContent =
      `---\n` +
      `${stringifiedProperties}` +
      `---\n` +
      `${text}`;

    await writeFile(absolutePath, updatedContent, { mode: '644' });
    await delay(500);
  } catch (err) {
    console.error(err);
  }
}

async function processHabits(habits) {
  let index = 0;
  const updatedPropertiesByPath = { ...PROPERTIES_BY_PATH };

  for await (const { records, name, status } of habits) {
    index++;
    console.log(`${index} out of ${habits.length}`);

    if (status !== 1) continue; // Exclude archived

    for (const { create_t, record_value: recordValue, record_type: recordType } of records) {
      const date = new Date(create_t * 1000);
      const day = String(date.getDate() + 1).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const relativePath = `${year}/${month}/${day}.md`;

      const record = recordType && [0, 1, 2].includes(recordType) ? Boolean(recordValue) : recordValue;

      updatedPropertiesByPath[relativePath] = { ...(updatedPropertiesByPath[relativePath] || {}), [name]: record };
    }
  }

  return updatedPropertiesByPath;
}

(async () => {
  const properties = await processHabits(habits);

  Object.keys(properties).forEach(async (path) => {
    await writePropertiesToFile(path, properties[path]);
  })
})();
