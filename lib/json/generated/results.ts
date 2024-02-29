import { EventFormat, EventResults } from '@/lib/event-data';
import typia from 'typia';
export const isResultsClimbing = (input: any): input is EventResults<'climbing'> => {
    const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) && $io1(input.active)) && Object.keys(input).every((key: any) => {
        if (["active"].some((prop: any) => key === prop))
            return true;
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
        return true;
    });
    const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant);
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
    const $io4 = (input: any): boolean => Array.isArray(input.result) && input.result.every((elem: any) => Array.isArray(elem) && elem.every((elem: any) => null === elem || "object" === typeof elem && null !== elem && $io5(elem))) && (undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status);
    const $io5 = (input: any): boolean => "number" === typeof input.startedAt && (undefined === input.zoneAt || "number" === typeof input.zoneAt) && (undefined === input.topAt || "number" === typeof input.topAt) && (undefined === input.topAtProvisional || "number" === typeof input.topAtProvisional) && (undefined === input.endedAt || "number" === typeof input.endedAt);
    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
};
export const isResultsIceSkating = (input: any): input is EventResults<'ice-skating'> => {
    const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) && $io1(input.active)) && Object.keys(input).every((key: any) => {
        if (["active"].some((prop: any) => key === prop))
            return true;
        const value = input[key];
        if (undefined === value)
            return true;
        if (true)
            return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
        return true;
    });
    const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant);
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
    const $io4 = (input: any): boolean => "object" === typeof input.result && null !== input.result && ("number" === typeof (input.result as any).tech && "number" === typeof (input.result as any).pres && "number" === typeof (input.result as any).ddct) && (undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status);
    return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
};
export const validateResultsClimbing = (input: any): typia.IValidation<EventResults<'climbing'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventResults<'climbing'> => {
        const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) && $io1(input.active)) && Object.keys(input).every((key: any) => {
            if (["active"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
            return true;
        });
        const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant);
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
        const $io4 = (input: any): boolean => Array.isArray(input.result) && input.result.every((elem: any) => Array.isArray(elem) && elem.every((elem: any) => null === elem || "object" === typeof elem && null !== elem && $io5(elem))) && (undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status);
        const $io5 = (input: any): boolean => "number" === typeof input.startedAt && (undefined === input.zoneAt || "number" === typeof input.zoneAt) && (undefined === input.topAt || "number" === typeof input.topAt) && (undefined === input.topAtProvisional || "number" === typeof input.topAtProvisional) && (undefined === input.endedAt || "number" === typeof input.endedAt);
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventResults<'climbing'> => {
            const $join = (typia.createValidate as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.active || ("object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) || $report(_exceptionable, {
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
                    expected: "Array<{ startedAt: number; zoneAt?: number | undefined; topAt?: number | undefined; topAtProvisional?: number | undefined; endedAt?: number | undefined; } | null>",
                    value: elem
                })) && elem.map((elem: any, _index2: number) => null === elem || ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "][" + _index2 + "]",
                    expected: "(__type.o3 | null)",
                    value: elem
                })) && $vo5(elem, _path + ".result[" + _index1 + "][" + _index2 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "][" + _index2 + "]",
                    expected: "(__type.o3 | null)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".result[" + _index1 + "]",
                    expected: "Array<{ startedAt: number; zoneAt?: number | undefined; topAt?: number | undefined; topAtProvisional?: number | undefined; endedAt?: number | undefined; } | null>",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".result",
                    expected: "EventResultClimbing",
                    value: input.result
                }), undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status || $report(_exceptionable, {
                    path: _path + ".status",
                    expected: "(\"DNF\" | \"DNS\" | \"DQ\" | undefined)",
                    value: input.status
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
        const $io0 = (input: any): boolean => (undefined === input.active || "object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) && $io1(input.active)) && Object.keys(input).every((key: any) => {
            if (["active"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "object" === typeof value && null !== value && false === Array.isArray(value) && $io2(value);
            return true;
        });
        const $io1 = (input: any): boolean => (undefined === input.round || "string" === typeof input.round) && (undefined === input["class"] || "string" === typeof input["class"]) && (undefined === input.entrant || "number" === typeof input.entrant);
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
        const $io4 = (input: any): boolean => "object" === typeof input.result && null !== input.result && ("number" === typeof (input.result as any).tech && "number" === typeof (input.result as any).pres && "number" === typeof (input.result as any).ddct) && (undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status);
        return "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventResults<'ice-skating'> => {
            const $join = (typia.createValidate as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.active || ("object" === typeof input.active && null !== input.active && false === Array.isArray(input.active) || $report(_exceptionable, {
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
                }), undefined === input.status || "DNS" === input.status || "DNF" === input.status || "DQ" === input.status || $report(_exceptionable, {
                    path: _path + ".status",
                    expected: "(\"DNF\" | \"DNS\" | \"DQ\" | undefined)",
                    value: input.status
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
export const parseResultsClimbing = (input: string): typia.IValidation<typia.Primitive<EventFormat<'climbing'>>> => { const validate = (input: any): typia.IValidation<EventFormat<'climbing'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormat<'climbing'> => {
        const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
        const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "qualifying" === input.kind || "semifinal" === input.kind || "final" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.json.createValidateParse as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventFormat<'climbing'> => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.rounds) || $report(_exceptionable, {
                    path: _path + ".rounds",
                    expected: "Array<__type>",
                    value: input.rounds
                })) && input.rounds.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".rounds[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo1(elem, _path + ".rounds[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".rounds[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".rounds",
                    expected: "Array<__type>",
                    value: input.rounds
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.kind || "qualifying" === input.kind || "semifinal" === input.kind || "final" === input.kind || $report(_exceptionable, {
                    path: _path + ".kind",
                    expected: "(\"final\" | \"qualifying\" | \"semifinal\" | undefined)",
                    value: input.kind
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), (Array.isArray(input.classes) || $report(_exceptionable, {
                    path: _path + ".classes",
                    expected: "Array<RoundClass>",
                    value: input.classes
                })) && input.classes.map((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".classes[" + _index2 + "]",
                    expected: "RoundClass",
                    value: elem
                })) && $vo2(elem, _path + ".classes[" + _index2 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".classes[" + _index2 + "]",
                    expected: "RoundClass",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".classes",
                    expected: "Array<RoundClass>",
                    value: input.classes
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.active || "boolean" === typeof input.active || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(boolean | undefined)",
                    value: input.active
                }), Array.isArray(input.entrants) || $report(_exceptionable, {
                    path: _path + ".entrants",
                    expected: "Array<__type<\"entrants\">>",
                    value: input.entrants
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "EventFormatClimbing",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "EventFormatClimbing",
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
}; const output = JSON.parse(input); return validate(output) as any; };
export const parseResultsIceSkating = (input: string): typia.IValidation<typia.Primitive<EventFormat<'ice-skating'>>> => { const validate = (input: any): typia.IValidation<EventFormat<'ice-skating'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormat<'ice-skating'> => {
        const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
        const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "short-prog" === input.kind || "free-skate" === input.kind || "free-prog" === input.kind || "pattern-dance" === input.kind || "rhythm-dance" === input.kind || "free-dance" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.json.createValidateParse as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventFormat<'ice-skating'> => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.rounds) || $report(_exceptionable, {
                    path: _path + ".rounds",
                    expected: "Array<__type>",
                    value: input.rounds
                })) && input.rounds.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".rounds[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo1(elem, _path + ".rounds[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".rounds[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".rounds",
                    expected: "Array<__type>",
                    value: input.rounds
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.kind || "short-prog" === input.kind || "free-skate" === input.kind || "free-prog" === input.kind || "pattern-dance" === input.kind || "rhythm-dance" === input.kind || "free-dance" === input.kind || $report(_exceptionable, {
                    path: _path + ".kind",
                    expected: "(\"free-dance\" | \"free-prog\" | \"free-skate\" | \"pattern-dance\" | \"rhythm-dance\" | \"short-prog\" | undefined)",
                    value: input.kind
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), (Array.isArray(input.classes) || $report(_exceptionable, {
                    path: _path + ".classes",
                    expected: "Array<RoundClass>",
                    value: input.classes
                })) && input.classes.map((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".classes[" + _index2 + "]",
                    expected: "RoundClass",
                    value: elem
                })) && $vo2(elem, _path + ".classes[" + _index2 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".classes[" + _index2 + "]",
                    expected: "RoundClass",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".classes",
                    expected: "Array<RoundClass>",
                    value: input.classes
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.active || "boolean" === typeof input.active || $report(_exceptionable, {
                    path: _path + ".active",
                    expected: "(boolean | undefined)",
                    value: input.active
                }), Array.isArray(input.entrants) || $report(_exceptionable, {
                    path: _path + ".entrants",
                    expected: "Array<__type<\"entrants\">>",
                    value: input.entrants
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "EventFormatIceSkating",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "EventFormatIceSkating",
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
}; const output = JSON.parse(input); return validate(output) as any; };
