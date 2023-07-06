import { DecoratedFrame } from '../models';

import { Core } from './core';
import { MatrixManager } from './matrix-manager';

export class Commands {
  constructor(private readonly _core: Core, private readonly _matrixManager: MatrixManager) {
  }

  public deleteSelectedItems(): void {
    this._core.deleteActivatedItems();
  }

  public mergeSelectedItems(): void {
    this._core.mergeActivatedItems();
  }

  public mergeAllItems(): void {
    this._core.mergeAllItems();
  }

  public splitAllItems(): void {
    this._core.splitAllItems();
  }

  public splitSelectedItems(): void {
    this._core.splitActivatedItems();
  }

  public getItemByAddress(x: number, y: number): DecoratedFrame {
    const matrix = this._matrixManager.snapshot;

    return matrix[x][y];
  }
}
