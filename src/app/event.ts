class Event {
    observers : (() => void)[] = [];

    attach(listener: () => void): void {
        if (typeof listener !== 'function') return;
        this.observers.push(listener);
    }

    notify(): void {
        for (let i = 0; i < this.observers.length; i += 1) {
            this.observers[i]();
        }
    }
}

export { Event };
