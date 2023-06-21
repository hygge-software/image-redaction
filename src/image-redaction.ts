import { Destroyable, Matrix, MatrixItem, Position } from './models';
import { ComponentsContainer, Image } from './components';
import {
  Commands,
  ComponentFactory,
  Core,
  IocContainer,
  MatrixManager,
  StyleConfigurator,
} from './core';
import { IS_READONLY_TOKEN, ROOT_ELEMENT_TOKEN } from './tokens';
import { Subscription } from './common';
import { ActionType } from './constants';

interface Config {
  matrix?: Matrix<{ position: Position }>;
  isReadonly: boolean;
  imageSource: string;
  hostElement: HTMLElement;
}

export class ImageRedaction implements Destroyable {
  public readonly commands: Commands;

  private readonly _iocContainer: IocContainer;
  private readonly _core: Core;
  private readonly _matrixManager: MatrixManager;
  private _destroyed = false;

  constructor(config: Config) {
    this._iocContainer = new IocContainer();

    this._matrixManager = new MatrixManager();
    this._iocContainer.register(MatrixManager, this._matrixManager);

    this._core = new Core(this._iocContainer);
    this._iocContainer.register(Core, this._core);

    this.commands = new Commands(this._core, this._matrixManager);

    const rootElement = document.createElement('div');
    const shadowRoot = rootElement.attachShadow({ mode: 'open' });

    config.hostElement.appendChild(rootElement);

    const styleConfigurator = new StyleConfigurator(shadowRoot);
    const componentFactory = new ComponentFactory(styleConfigurator);

    this._iocContainer.register(ROOT_ELEMENT_TOKEN, rootElement);
    this._iocContainer.register(IS_READONLY_TOKEN, config.isReadonly);
    this._iocContainer.register(ComponentFactory, componentFactory);

    const componentsContainer = componentFactory
      .create(ComponentsContainer, this._iocContainer)
      .appendTo(shadowRoot);

    this._iocContainer.register(ComponentsContainer, componentsContainer);

    const image = componentFactory.create(Image, config.imageSource).appendTo(componentsContainer);

    this._iocContainer.register(Image, image);

    this._core.createMatrix(config.matrix);
  }

  public get imageElement(): HTMLImageElement {
    const image = this._iocContainer.get(Image);
    return image.element;
  }

  public observeOn(
    fn: (actions: { type: ActionType; matrix: Matrix<MatrixItem> }) => void,
    ...actionTypes: ActionType[]
  ): Subscription {
    return this._matrixManager.observe(fn, ...actionTypes);
  }

  public observeMatrix(fn: (matrix: Matrix<MatrixItem>) => void): Subscription {
    fn(this._matrixManager.snapshot);
    return this._matrixManager.observe(({ matrix }) => fn(matrix));
  }

  public getMatrixSnapshot(): Matrix<MatrixItem> {
    return this._matrixManager.snapshot;
  }

  public destroy(): void {
    if (this._destroyed) {
      return;
    }

    const rootElement = this._iocContainer.get<HTMLElement>(ROOT_ELEMENT_TOKEN);
    const componentsContainer = this._iocContainer.get(ComponentsContainer);

    this._matrixManager.destroy();
    this._iocContainer.destroy();
    componentsContainer.destroy();
    rootElement.remove();
    this._destroyed = true;
  }
}
