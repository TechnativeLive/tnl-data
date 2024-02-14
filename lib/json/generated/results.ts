import { EventResults } from '@/lib/event-data';
import typia from 'typia';
export const isResultsClimbing = (input: any): input is EventResults<'climbing'> => {
    const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && $io1(input.active)) && Object.keys(input).every((key: any) => {
        if (["active"].some((prop: any) => key === prop))
            return true;
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
        return true;
    });
    const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant) && "number" === typeof input.__ts;
    const $io2 = (input: any): boolean => Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io3(value);
        return true;
    });
    const $io3 = (input: any): boolean => Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && $io4(value);
        return true;
    });
    const $io4 = (input: any): boolean => Array.isArray(input.result) && input.result.every((elem: any) => Array.isArray(elem) && elem.every((elem: any) => "object" === typeof elem && null !== elem && $io5(elem))) && "number" === typeof input.__ts;
    const $io5 = (input: any): boolean => "number" === typeof input.startedAt && (undefined === input.zoneAt || "number" === typeof input.zoneAt) && (undefined === input.topAt || "number" === typeof input.topAt) && (undefined === input.topAtProvisional || "number" === typeof input.topAtProvisional) && (undefined === input.endedAt || "number" === typeof input.endedAt) && (undefined === input.active || "boolean" === typeof input.active);
    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
};
export const isResultsIceSkating = (input: any): input is EventResults<'ice-skating'> => {
    const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && $io1(input.active)) && Object.keys(input).every((key: any) => {
        if (["active"].some((prop: any) => key === prop))
            return true;
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
        return true;
    });
    const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant) && "number" === typeof input.__ts;
    const $io2 = (input: any): boolean => Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io3(value);
        return true;
    });
    const $io3 = (input: any): boolean => Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && $io4(value);
        return true;
    });
    const $io4 = (input: any): boolean => "object" === typeof input.result && null !== input.result && ("number" === typeof (input.result as any).tech && "number" === typeof (input.result as any).pres && "number" === typeof (input.result as any).ddct) && "number" === typeof input.__ts;
    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
};
export const validateResultsClimbing = (input: any): typia.IValidation<EventResults<'climbing'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventResults<'climbing'> => {
        const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && $io1(input.active)) && Object.keys(input).every((key: any) => {
            if (["active"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
            return true;
        });
        const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant) && "number" === typeof input.__ts;
        const $io2 = (input: any): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io3(value);
            return true;
        });
        const $io3 = (input: any): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && $io4(value);
            return true;
        });
        const $io4 = (input: any): boolean => Array.isArray(input.result) && input.result.every((elem: any) => Array.isArray(elem) && elem.every((elem: any) => "object" === typeof elem && null !== elem && $io5(elem))) && "number" === typeof input.__ts;
        const $io5 = (input: any): boolean => "number" === typeof input.startedAt && (undefined === input.zoneAt || "number" === typeof input.zoneAt) && (undefined === input.topAt || "number" === typeof input.topAt) && (undefined === input.topAtProvisional || "number" === typeof input.topAtProvisional) && (undefined === input.endedAt || "number" === typeof input.endedAt) && (undefined === input.active || "boolean" === typeof input.active);
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventResults<'climbing'> => {
            const $join = (typia.createValidate as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.active || ("object" === typeof input.active && null !== input.active || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(__type | undefined)",
                    value: input.active
                })) && $vo1(input.active, _path + ".active", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(__type | undefined)",
                    value: input.active
                }), false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["active"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value && false === Array.isArray(value) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o1 | undefined)",
                            value: value
                        })) && $vo2(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o1 | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.round || "string" === typeof input.round || $report(_exceptionable, {
                    path: _path + ".round",
                    expected: "(string | undefined)",
                    value: input.round
                }), undefined === input["class"] || "string" === typeof input["class"] || $report(_exceptionable, {
                    path: _path + "[\"class\"]",
                    expected: "(string | undefined)",
                    value: input["class"]
                }), undefined === input.entrant || "number" === typeof input.entrant || $report(_exceptionable, {
                    path: _path + ".entrant",
                    expected: "(number | undefined)",
                    value: input.entrant
                }), "number" === typeof input.__ts || $report(_exceptionable, {
                    path: _path + ".__ts",
                    expected: "number",
                    value: input.__ts
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value && false === Array.isArray(value) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o2 | undefined)",
                            value: value
                        })) && $vo3(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o2 | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(EventResult<\"climbing\"> | undefined)",
                            value: value
                        })) && $vo4(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(EventResult<\"climbing\"> | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.result) || $report(_exceptionable, {
                    path: _path + ".result",
                    expected: "EventResultClimbing",
                    value: input.result
                })) && input.result.map((elem: any, _index1: number) => (Array.isArray(elem) || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "]",
                    expected: "Array<__type>",
                    value: elem
                })) && elem.map((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "][" + _index2 + "]",
                    expected: "__type.o3",
                    value: elem
                })) && $vo5(elem, _path + ".result[" + _index1 + "][" + _index2 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "][" + _index2 + "]",
                    expected: "__type.o3",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "]",
                    expected: "Array<__type>",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".result",
                    expected: "EventResultClimbing",
                    value: input.result
                }), "number" === typeof input.__ts || $report(_exceptionable, {
                    path: _path + ".__ts",
                    expected: "number",
                    value: input.__ts
                })].every((flag: boolean) => flag);
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.startedAt || $report(_exceptionable, {
                    path: _path + ".startedAt",
                    expected: "number",
                    value: input.startedAt
                }), undefined === input.zoneAt || "number" === typeof input.zoneAt || $report(_exceptionable, {
                    path: _path + ".zoneAt",
                    expected: "(number | undefined)",
                    value: input.zoneAt
                }), undefined === input.topAt || "number" === typeof input.topAt || $report(_exceptionable, {
                    path: _path + ".topAt",
                    expected: "(number | undefined)",
                    value: input.topAt
                }), undefined === input.topAtProvisional || "number" === typeof input.topAtProvisional || $report(_exceptionable, {
                    path: _path + ".topAtProvisional",
                    expected: "(number | undefined)",
                    value: input.topAtProvisional
                }), undefined === input.endedAt || "number" === typeof input.endedAt || $report(_exceptionable, {
                    path: _path + ".endedAt",
                    expected: "(number | undefined)",
                    value: input.endedAt
                }), undefined === input.active || "boolean" === typeof input.active || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(boolean | undefined)",
                    value: input.active
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input && false === Array.isArray(input) || $report(true, {
                path: _path + "",
                expected: "EventResults<\"climbing\">",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "EventResults<\"climbing\">",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
export const validateResultsIceSkating = (input: any): typia.IValidation<EventResults<'ice-skating'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventResults<'ice-skating'> => {
        const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && $io1(input.active)) && Object.keys(input).every((key: any) => {
            if (["active"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
            return true;
        });
        const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant) && "number" === typeof input.__ts;
        const $io2 = (input: any): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io3(value);
            return true;
        });
        const $io3 = (input: any): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && $io4(value);
            return true;
        });
        const $io4 = (input: any): boolean => "object" === typeof input.result && null !== input.result && ("number" === typeof (input.result as any).tech && "number" === typeof (input.result as any).pres && "number" === typeof (input.result as any).ddct) && "number" === typeof input.__ts;
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventResults<'ice-skating'> => {
            const $join = (typia.createValidate as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.active || ("object" === typeof input.active && null !== input.active || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(__type | undefined)",
                    value: input.active
                })) && $vo1(input.active, _path + ".active", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(__type | undefined)",
                    value: input.active
                }), false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["active"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value && false === Array.isArray(value) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o1 | undefined)",
                            value: value
                        })) && $vo2(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o1 | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.round || "string" === typeof input.round || $report(_exceptionable, {
                    path: _path + ".round",
                    expected: "(string | undefined)",
                    value: input.round
                }), undefined === input["class"] || "string" === typeof input["class"] || $report(_exceptionable, {
                    path: _path + "[\"class\"]",
                    expected: "(string | undefined)",
                    value: input["class"]
                }), undefined === input.entrant || "number" === typeof input.entrant || $report(_exceptionable, {
                    path: _path + ".entrant",
                    expected: "(number | undefined)",
                    value: input.entrant
                }), "number" === typeof input.__ts || $report(_exceptionable, {
                    path: _path + ".__ts",
                    expected: "number",
                    value: input.__ts
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value && false === Array.isArray(value) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o2 | undefined)",
                            value: value
                        })) && $vo3(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(__type.o2 | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if (true)
                        return undefined === value || ("object" === typeof value && null !== value || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(EventResult<\"ice-skating\"> | undefined)",
                            value: value
                        })) && $vo4(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "(EventResult<\"ice-skating\"> | undefined)",
                            value: value
                        });
                    return true;
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [("object" === typeof input.result && null !== input.result || $report(_exceptionable, {
                    path: _path + ".result",
                    expected: "EventResultIceSkating",
                    value: input.result
                })) && $vo5(input.result, _path + ".result", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".result",
                    expected: "EventResultIceSkating",
                    value: input.result
                }), "number" === typeof input.__ts || $report(_exceptionable, {
                    path: _path + ".__ts",
                    expected: "number",
                    value: input.__ts
                })].every((flag: boolean) => flag);
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.tech || $report(_exceptionable, {
                    path: _path + ".tech",
                    expected: "number",
                    value: input.tech
                }), "number" === typeof input.pres || $report(_exceptionable, {
                    path: _path + ".pres",
                    expected: "number",
                    value: input.pres
                }), "number" === typeof input.ddct || $report(_exceptionable, {
                    path: _path + ".ddct",
                    expected: "number",
                    value: input.ddct
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input && false === Array.isArray(input) || $report(true, {
                path: _path + "",
                expected: "EventResults<\"ice-skating\">",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "EventResults<\"ice-skating\">",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
