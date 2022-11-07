import Dexie, { Table } from 'dexie';



export interface ITableIgnoredWords {
  id?: number;
  word: string;
  lang: string;
}

export interface ITableUserDictionary {
  id?: number;
  word: string;
  wordAttached: string;
  lang: string;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  ignoredWords!: Table<ITableIgnoredWords>; 
  userDictionary!: Table<ITableUserDictionary>;
  constructor() {
    super('lucas_teste');
    this.version(1).stores({
      ignoredWords: '++id, &[word+lang], word, lang',
      userDictionary: '++id, &[word+wordAttached+lang], word, wordAttached, lang'
    });
  }
}

export const db = new MySubClassedDexie();