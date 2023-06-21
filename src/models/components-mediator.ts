import { Position } from './position';

export interface ComponentsMediator {
  position: Position;
  id: string;
  isInvalid: boolean;

  toggleIsActivated(): void;

  validateSize(): void;
}
