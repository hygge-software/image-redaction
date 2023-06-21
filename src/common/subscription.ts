interface Subscriable {
  unsubscribe(): void;
}

export class Subscription implements Subscriable {
  private _subscriptionsList: Subscriable[] = [];

  constructor(unsubscribe?: () => void) {
    if (unsubscribe) {
      this._subscriptionsList.push({ unsubscribe });
    }
  }

  public add(subscription: Subscription): void {
    this._subscriptionsList.push(subscription);
  }

  public unsubscribe(): void {
    this._subscriptionsList.forEach(subscription => subscription.unsubscribe());
    this._subscriptionsList = [];
  }
}
