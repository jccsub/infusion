
export interface FileEnumerator {
  enumerate(folder: string): Array<string>;
}