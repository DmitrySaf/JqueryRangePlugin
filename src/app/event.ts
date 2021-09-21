class Event {
    observers : any = [];
  
    attach(listener: any): void {
        if (typeof listener !== 'function') return;
        this.observers.push(listener);
    }

    notify(args?: any): void {
        for (let i = 0; i < this.observers.length; i += 1) {
            this.observers[i](args);
        }
    }
}
  
export { Event };