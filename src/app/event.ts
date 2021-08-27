/* interface Array {
    [index: number]: function
}

class EventHandler {
    listeners : any = [];
  
    attach(listener: any): void {
        if (typeof listener !== 'function') return;
        this.listeners.push(listener);
    }

    notify(args: any): void {
        for (let i = 0; i < this.listeners.length; i += 1) {
            this.listeners[i](args);
        }
    }
}
  
export { EventHandler }; */