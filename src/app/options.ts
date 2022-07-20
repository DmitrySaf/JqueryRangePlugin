const defaultOptions: IDefinedOptions = {
    min: 0,
    max: 10000,
    from: 3000,
    to: 7000,
    step: 1,
    double: false,
    vertical: false,
    scale: false,
    scaleFrequency: 5
};

interface IDefinedOptions {
    [index: string]: number | boolean,
    min: number,
    max: number,
    from: number,
    to: number,
    step: number,
    vertical: boolean,
    double: boolean,
    scale: boolean,
    scaleFrequency: number
}

interface IUndefinedOptions {
    min?: number,
    max?: number,
    from?: number,
    to?: number,
    step?: number,
    vertical?: boolean,
    double?: boolean,
    scale?: boolean,
    scaleFrequency?: number
}

interface Coords {
    from: number,
    to: number
}

export { defaultOptions, IDefinedOptions, Coords, IUndefinedOptions };
