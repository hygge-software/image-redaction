import { Matrix, Position } from '~/models';
import { ActionType } from '~/constants';

import { IocContainer } from './ioc-container';
import { RedactionItem } from './redaction-item';
import { MatrixManager } from './matrix-manager';

export class Core {
  private readonly _matrixManager: MatrixManager;

  constructor(private readonly _iocContainer: IocContainer) {
    this._matrixManager = _iocContainer.get(MatrixManager);
  }

  public createMatrix(initialMatrix: Matrix<{ position: Position }> = []): void {
    const matrix = initialMatrix.map(group => {
      return group.map(({ position }) => new RedactionItem(this._iocContainer, position));
    });

    this._matrixManager.broadcast({ type: ActionType.CREATE_MATRIX, matrix });
  }

  public addItem(position: Position): void {
    const prevMatrix = this._matrixManager.snapshot;
    const nextMatrix = [...prevMatrix, [new RedactionItem(this._iocContainer, position)]];

    this._matrixManager.broadcast({ type: ActionType.ADD_ITEM, matrix: nextMatrix });
  }

  public deleteActivatedItems(): void {
    const prevMatrix = this._matrixManager.snapshot;

    const nextMatrix = prevMatrix
      .map(group => {
        return group.filter(item => {
          if (item.isActivated) {
            item.destroy();
            return false;
          }

          return true;
        });
      })
      .filter(group => group.length > 0);

    this._matrixManager.broadcast({ type: ActionType.DELETE_ACTIVATED, matrix: nextMatrix });
  }

  public mergeAllItems(): void {
    const prevMatrix = this._matrixManager.snapshot;
    const nextMatrix = [prevMatrix.flat()].filter(group => group.length > 0);

    this._matrixManager.broadcast({ type: ActionType.MERGE_ALL, matrix: nextMatrix });
  }

  public splitAllItems(): void {
    const prevMatrix = this._matrixManager.snapshot;
    const nextMatrix = prevMatrix.flat().map(item => [item]);

    this._matrixManager.broadcast({ type: ActionType.SPLIT_ALL, matrix: nextMatrix });
  }

  public mergeActivatedItems(): void {
    const prevMatrix = this._matrixManager.snapshot;

    const groupOfMergedItems: RedactionItem[] = [];

    const nextMatrix = prevMatrix
      .map(group => {
        return group.filter(item => {
          if (item.isActivated) {
            groupOfMergedItems.push(item);
            return false;
          }

          return true;
        });
      })
      .filter(group => group.length > 0);

    if (groupOfMergedItems.length) {
      nextMatrix.push(groupOfMergedItems);
    }

    this._matrixManager.broadcast({ type: ActionType.MERGE_ACTIVATED, matrix: nextMatrix });
  }

  public splitActivatedItems(): void {
    const prevMatrix = this._matrixManager.snapshot;
    const matrixOfSplitItems: Matrix<RedactionItem> = [];

    const matrix = prevMatrix
      .map(group => {
        return group.filter(item => {
          if (item.isActivated) {
            matrixOfSplitItems.push([item]);
            return false;
          }

          return true;
        });
      })
      .filter(group => group.length > 0);

    const nextMatrix = [...matrix, ...matrixOfSplitItems];

    this._matrixManager.broadcast({ type: ActionType.SPLIT_ACTIVATED, matrix: nextMatrix });
  }
}
