export class Parameter implements IParameter {
    @Log()
    public getValue(name: string) {
        return name;
    }
}

function Log() {
    return (targetlol: any, name: string, descriptor: any) => {
        console.log(`call to ${name}`);
        return descriptor;
    };
}

