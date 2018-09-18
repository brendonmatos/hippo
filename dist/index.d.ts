export interface HippoConfig {
    methods?: any;
    variables?: any;
    variablePrefix?: string;
    methodPrefix?: string;
    variableResolver?: Function;
    plugins?: [((config?: HippoConfig) => void)?];
}
export default class Hippo {
    config: HippoConfig;
    _variableResolver: Function;
    _methods: {};
    _variables: {};
    constructor(config?: HippoConfig);
    _configure(config?: HippoConfig): void;
    registerMethod(name: any, fn: any): void;
    executeMethod(name: any, args: any): any;
    isMethod(fragment: any): boolean;
    isVariable(fragment: any): boolean;
    registerVariable(name: any, value: any): void;
    resolveVariable(name: any): any;
    dump(): {};
    exec(expression: any): any;
}
