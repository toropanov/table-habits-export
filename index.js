import fs from 'fs';
import util from 'util';
// import { exec } from "child_process";
import {exec} from "node:child_process";

const TABLE_HABIT_BACKUP_PATH = 'data.json';
const DIARY_PATH = '../../Yandex.Disk.localized/Obsidian/Diary/Data';

const jsonData = fs.readFileSync(TABLE_HABIT_BACKUP_PATH, 'utf8');
const { habits } = JSON.parse(jsonData);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const existsSync = util.promisify(fs.existsSync);
const execPromise = util.promisify(exec);

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

habits.forEach(async ({ records, name, status }) => {
  await delay(500);
  if (status !== 1) return;
  for (const { create_t, record_value: recordValue, record_type: recordType } of records) {
    await delay(500);
    const date = new Date(create_t * 1000);
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const relativePath = `${year}/${month}/${day}.md`;
    const absolutePath = `${DIARY_PATH}/${relativePath}`;
    // const absolutePath = '/Users/tanotify/Yandex.Disk.localized/Obsidian/Diary/Data/2024/03/13.md';

    const record = recordType && [0, 1, 2].includes(recordType) ? Boolean(recordValue) : recordValue;

    try {
      await delay(500);
      const data = await readFileIfExists(absolutePath);

      const regex = /^---(.*?)^---/gms;
      const properties = Array.from(data.matchAll(regex), m => m[1].trim().split('\n'))[0]?.reduce((prev, line) => {
        const [key, value] = line.split(': ');
        return { ...prev, [key]: value };
      }, {}) || {};

      const parts = data.split('---');
      const lastIndex = parts.length - 1;
      const text = parts[lastIndex].trim();

      properties[name] = record;

      
      let updatedContent = '';
      const propertyKeys = Object.keys(properties);
      if (propertyKeys.length > 0) {
        updatedContent += '---\n';
        propertyKeys.forEach(property => {
          updatedContent += `${property}: ${properties[property]}\n`;
        });
        updatedContent += '---\n';
      }
      updatedContent += text.trim();

      console.log('---')
      console.log('BEFORE UPDATE', text.trim())
      console.log('---')

      await delay(500);

      await writeFile(absolutePath, updatedContent, { mode: '644' })

      // const stream = fs.createWriteStream(absolutePath, { mode: '0o644' });
      // stream.write(updatedContent);
      // stream.end();
      // console.log('AFTER', { updatedContent, properties });
      await delay(500);
    } catch (err) {
      console.error(err);
    }
  }
});
