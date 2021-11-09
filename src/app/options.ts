const defaultOptions : IOptions = {
    min: 0,
    max: 10000,
    from: 3000,
    to: 7000,
    step: 1,
    double: false,
    vertical: false,
};

interface IOptions {
    [index : string]: number | boolean,
    min: number,
    max: number,
    from: number,
    to: number,
    step: number,
    vertical: boolean,
    double: boolean
}

export { defaultOptions, IOptions };
