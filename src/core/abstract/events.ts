import {IEventDispatcher} from "../interfaces/events.ts";

export abstract class EventDispatcher<T> implements IEventDispatcher<T> {
  private $listeners: Record<T, Function[]> = {} as Record<T, Function[]>;

  on(event: T, listener: Function): void {
    if (!this.$listeners[event]) {
      this.$listeners[event] = [];
    }
    this.$listeners[event].push(listener);
  }

  protected dispatch(event: T, ...args: any[]) {
    this.$listeners[event]?.forEach(listener => listener(...args));
  }
}
