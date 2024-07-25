export interface IEventDispatcher<T> {
  on(event: T, listener: Function): void;
}
