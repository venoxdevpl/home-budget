type Callback = (action: any) => void;

class Dispatcher {
    private callbacks: Callback[] = [];

    register(callback: Callback): () => void {
        this.callbacks.push(callback);

        return () => {
            const index = this.callbacks.indexOf(callback);

            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        };
    }

    dispatch(action: any): void {
        this.callbacks.forEach((callback) => callback(action));
    }
}

export const dispatcher = new Dispatcher();
