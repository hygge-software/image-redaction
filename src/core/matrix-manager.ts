import { EventObserver, Subscription } from '~/common';
import { ActionType } from '~/constants';
import { Destroyable, Matrix } from '~/models';

import { RedactionItem } from './redaction-item';

type MatrixAction = {
  type: ActionType;
  matrix?: Matrix<RedactionItem>;
};

export class MatrixManager implements Destroyable {
  private readonly _matrixObserver = new EventObserver<Required<MatrixAction>>();
  private _matrix: Matrix<RedactionItem> = [];
  private _destroyed = false;

  public get snapshot(): Matrix<RedactionItem> {
    return this._matrix;
  }

  public observe(
    fn: (actions: { type: ActionType; matrix: Matrix<RedactionItem> }) => void,
    ...actionTypes: ActionType[]
  ): Subscription {
    if (actionTypes.length) {
      return this._matrixObserver.subscribe(action => {
        if (actionTypes.includes(action.type)) {
          fn(action);
        }
      });
    }

    return this._matrixObserver.subscribe(fn);
  }

  public broadcast({ type, matrix }: MatrixAction): void {
    const nextMatrix = matrix || this._matrix;
    this._matrix = [...nextMatrix];

    this._matrixObserver.broadcast({ type, matrix: this._matrix });
  }

  public destroy(): void {
    if (this._destroyed) {
      return;
    }

    this._matrix.forEach(group => group.forEach(item => item.destroy()));
    this._matrixObserver.complete();
    this._matrix = [];
    this._destroyed = true;
  }
}
