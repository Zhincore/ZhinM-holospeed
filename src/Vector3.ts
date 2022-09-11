type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift" | number;
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never;
type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};

type IVector3 = FixedLengthArray<[number, number, number]> & { [x in number]: number };
interface IVector3Constuctor {
  new (...items: number[]): IVector3;
}

export class Vector3 extends (Array as any as IVector3Constuctor) {
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z);
  }

  get x() {
    return this[0];
  }
  set x(val: number) {
    this[0] = val;
  }

  get y() {
    return this[1];
  }
  set y(val: number) {
    this[1] = val;
  }

  get z() {
    return this[2];
  }
  set z(val: number) {
    this[2] = val;
  }

  private getVec(vecOrScal: Vector3 | number) {
    return typeof vecOrScal === "number" ? [vecOrScal, vecOrScal, vecOrScal] : vecOrScal;
  }

  add(vecOrScal: Vector3 | number) {
    const vec = this.getVec(vecOrScal);
    return new Vector3(...this.map((v, i) => v + vec[i]));
  }

  sub(vecOrScal: Vector3 | number) {
    const vec = this.getVec(vecOrScal);
    return new Vector3(...this.map((v, i) => v - vec[i]));
  }

  mult(vecOrScal: Vector3 | number) {
    const vec = this.getVec(vecOrScal);
    return new Vector3(...this.map((v, i) => v * vec[i]));
  }

  div(vecOrScal: Vector3 | number) {
    const vec = this.getVec(vecOrScal);
    return new Vector3(...this.map((v, i) => v / vec[i]));
  }

  toTuple() {
    return Array.from(this) as [number, number, number];
  }
}
