export class OrderedCache<K, V> {
   private map: Map<K, V> = new Map<K, V>();
   private keys: K[] = [];

   constructor() {}

   public getKeys() {
      return this.keys;
   }

   public insert(key: K, value: V) {
      if (this.map.has(key)) this.keys.filter((k) => k !== key);
      this.keys.unshift(key);
      this.map.set(key, value);
   }

   public remove(key: K): V | null {
      const value = this.map.get(key);

      this.keys.filter((k) => k !== key);
      this.map.delete(key);

      return value ?? null;
   }

   public getValue(key: K): V | null {
      return this.map.get(key) ?? null;
   }

   public getRange(count: number, page: number) {
      const keys =
         page < 0 ? [] : this.keys.slice(count * page, count * (page + 1));
      return keys.map((key) => this.map.get(key)) as V[];
   }
}
