## Assign Table Habit records to Diary notes as markdown properties

After transitioning to Obsidian as my desktop client for journaling, I embarked on enhancing my posts with additional information such as habits, head migrates, steps, food tracking, and more. As part of this process, I utilized the [Table Habit app](https://github.com/FriesI23/mhabit) on Android to monitor habits. Although it doesn't sync directly, it offers export capabilities, which this tool leverages to associate those habits with diary files.

For journaling on Android, I rely on the [Diary app](https://github.com/billthefarmer/diary) and its file structure. Here is an overview of how it is organized:

```
- 2024
  - 02
    - 31.md
  - 04
    - 02.md
```

Please confirm that it aligns with your requirements, including the structure and other aspects.

## Usage

Prioritize by creating a backup of the diary folder as a precaution.

Generate a .env file and include paths to both the exported backup and diary folder.
```
TABLE_HABIT_BACKUP_PATH=data.json
DIARY_PATH=...
```

Next, place your data.json file in the project root directory and execute the following command.

```
yarn && node index.js
```

That's it.

