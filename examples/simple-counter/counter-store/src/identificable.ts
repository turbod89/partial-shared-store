let counter: number = 0;

export interface Identificable {
  id: number;
}

export const createIdentificable = (): Identificable => ({
  id: counter++,
});
