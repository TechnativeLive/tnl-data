import { EventFormat, EventFormatOptions } from '@/lib/event-data';
import typia from 'typia';
export const isFormatClimbing = (input: any): input is EventFormat<'climbing'> => {
    const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
    const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "qualifying" === input.kind || "semifinal" === input.kind || "final" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
    const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
    return "object" === typeof input && null !== input && $io0(input);
};
export const isFormatIceSkating = (input: any): input is EventFormat<'ice-skating'> => {
    const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
    const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "short-prog" === input.kind || "free-skate" === input.kind || "free-prog" === input.kind || "pattern-dance" === input.kind || "rhythm-dance" === input.kind || "free-dance" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
    const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
    return "object" === typeof input && null !== input && $io0(input);
};
export const validateFormatClimbing = (input: any): typia.IValidation<EventFormat<'climbing'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormat<'climbing'> => {
        const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
        const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "qualifying" === input.kind || "semifinal" === input.kind || "final" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
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
};
export const validateFormatIceSkating = (input: any): typia.IValidation<EventFormat<'ice-skating'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormat<'ice-skating'> => {
        const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
        const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "short-prog" === input.kind || "free-skate" === input.kind || "free-prog" === input.kind || "pattern-dance" === input.kind || "rhythm-dance" === input.kind || "free-dance" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
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
};
export const parseFormatClimbing = (input: any): typia.Primitive<EventFormat<'climbing'>> => { const is = (input: any): input is EventFormat<'climbing'> => {
    const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
    const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "qualifying" === input.kind || "semifinal" === input.kind || "final" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
    const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
    return "object" === typeof input && null !== input && $io0(input);
}; input = JSON.parse(input); return is(input) ? input as any : null; };
export const parseFormatIceSkating = (input: any): typia.Primitive<EventFormat<'ice-skating'>> => { const is = (input: any): input is EventFormat<'ice-skating'> => {
    const $io0 = (input: any): boolean => Array.isArray(input.rounds) && input.rounds.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem));
    const $io1 = (input: any): boolean => "string" === typeof input.id && (undefined === input.kind || "short-prog" === input.kind || "free-skate" === input.kind || "free-prog" === input.kind || "pattern-dance" === input.kind || "rhythm-dance" === input.kind || "free-dance" === input.kind) && "string" === typeof input.name && (Array.isArray(input.classes) && input.classes.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem)));
    const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (undefined === input.active || "boolean" === typeof input.active) && Array.isArray(input.entrants);
    return "object" === typeof input && null !== input && $io0(input);
}; input = JSON.parse(input); return is(input) ? input as any : null; };
// format options
export const isFormatOptionsClimbing = (input: any): input is EventFormatOptions<'climbing'> => {
    const $io0 = (input: any): boolean => "number" === typeof input.blocCount && (undefined === input.blocDataDsKey || "string" === typeof input.blocDataDsKey);
    return "object" === typeof input && null !== input && $io0(input);
};
export const isFormatOptionsIceSkating = (input: any): input is EventFormatOptions<'ice-skating'> => {
    return null === input || undefined === input;
};
export const validateFormatOptionsClimbing = (input: any): typia.IValidation<EventFormatOptions<'climbing'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormatOptions<'climbing'> => {
        const $io0 = (input: any): boolean => "number" === typeof input.blocCount && (undefined === input.blocDataDsKey || "string" === typeof input.blocDataDsKey);
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventFormatOptions<'climbing'> => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.blocCount || $report(_exceptionable, {
                    path: _path + ".blocCount",
                    expected: "number",
                    value: input.blocCount
                }), undefined === input.blocDataDsKey || "string" === typeof input.blocDataDsKey || $report(_exceptionable, {
                    path: _path + ".blocDataDsKey",
                    expected: "(string | undefined)",
                    value: input.blocDataDsKey
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "EventFormatOptionsClimbing",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "EventFormatOptionsClimbing",
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
export const validateFormatOptionsIceSkating = (input: any): typia.IValidation<EventFormatOptions<'ice-skating'>> => {
    const errors = [] as any[];
    const __is = (input: any): input is EventFormatOptions<'ice-skating'> => {
        return null === input || undefined === input;
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is EventFormatOptions<'ice-skating'> => {
            return null === input || undefined === input || $report(true, {
                path: _path + "",
                expected: "(null | undefined)",
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
