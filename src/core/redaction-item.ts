import { ComponentsMediator, DecoratedFrame, Destroyable, MatrixItem, Position } from '../models';
import { ComponentsContainer, Edge, InteractiveSquare, Label } from '../components';
import { ActionType, EDGE_SIDES, THRESHOLD_SIZE } from '../constants';
import { IS_READONLY_TOKEN } from '../tokens';

import { ComponentFactory } from './component-factory';
import { IocContainer } from './ioc-container';
import { MatrixManager } from './matrix-manager';

export class RedactionItem implements ComponentsMediator, MatrixItem, DecoratedFrame, Destroyable {
  public readonly id = crypto.randomUUID();

  private readonly _matrixManager: MatrixManager;
  private readonly _label?: Label;
  private readonly _edges?: Edge[];
  private readonly _square: InteractiveSquare;
  private _destroyed = false;

  constructor(iocContainer: IocContainer, position: Position) {
    this._position = position;
    this._matrixManager = iocContainer.get(MatrixManager);
    const componentFactory = iocContainer.get(ComponentFactory);
    const componentsContainer = iocContainer.get(ComponentsContainer);
    const isReadonly = iocContainer.get<boolean>(IS_READONLY_TOKEN);

    this._square = componentFactory
      .create(InteractiveSquare, iocContainer, this)
      .appendTo(componentsContainer);

    if (!isReadonly) {
      this._edges = EDGE_SIDES.map(side => {
        return componentFactory
          .create(Edge, iocContainer, this._square.element, side, this)
          .appendTo(this._square);
      });

      this._label = componentFactory.create(Label, iocContainer, this).appendTo(this._square);
    }
  }

  private _position: Position;

  public get position(): Position {
    return this._position;
  }

  public set position(value: Position) {
    this._position = value;
    this._matrixManager.broadcast({ type: ActionType.UPDATE_POSITION });
  }

  private _isActivated = false;

  public get isActivated(): boolean {
    return this._isActivated;
  }

  private _isInvalid = false;

  public get isInvalid(): boolean {
    return this._isInvalid;
  }

  public set isHighlighted(value: boolean) {
    this._square.isHighlighted = value;
  }

  public set isBlurred(value: boolean) {
    this._square.isBlurred = value;
  }

  public destroy(): void {
    if (this._destroyed) {
      return;
    }

    this._label?.destroy();
    this._edges?.forEach(e => e.destroy());
    this._square.destroy();
    this._destroyed = true;
  }

  public toggleIsActivated(): void {
    this._isActivated = !this.isActivated;
    this._label!.isActivated = this.isActivated;

    this._matrixManager.broadcast({ type: ActionType.TOGGLE_ITEM });
  }

  public validateSize(): void {
    const width = this._square.element.offsetWidth;
    const height = this._square.element.offsetHeight;
    const isInvalid = Math.min(width, height) < THRESHOLD_SIZE;

    this._square.isInvalid = isInvalid;
    this._isInvalid = isInvalid;
  }
}
