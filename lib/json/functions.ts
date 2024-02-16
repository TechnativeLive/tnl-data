import { Sport } from '@/lib/event-data';
import * as results from '@/lib/json/generated/results';
import * as format from '@/lib/json/generated/format';
import { LiteralUnion } from 'type-fest';
import { IValidation } from 'typia';

function fallthrough(
  sport?: string,
): Record<'results' | 'format' | 'formatOptions', (input: any) => IValidation<unknown>> {
  return {
    results: (_: unknown) => {
      console.warn(`Results validator/checker not found for ${sport}`);
      return { success: true, value: null, data: null, errors: [] };
    },
    format: (_: unknown) => {
      console.warn(`Format validator/checker not found for ${sport}`);
      return { success: true, value: null, data: null, errors: [] };
    },
    formatOptions: (_: unknown) => {
      console.warn(`Format options validator/checker not found for ${sport}`);
      return { success: true, value: null, data: null, errors: [] };
    },
  };
}

export const getParsers = (sport: LiteralUnion<Sport, string>) => {
  switch (sport) {
    case 'climbing':
      return {
        results: results.parseResultsClimbing,
        format: format.parseFormatClimbing,
      };
    case 'ice-skating':
      return {
        results: results.parseResultsIceSkating,
        format: format.parseFormatIceSkating,
      };
    default:
      return fallthrough(sport);
  }
};

export const getValidators = (sport?: LiteralUnion<Sport, string>) => {
  switch (sport) {
    case 'climbing':
      return {
        results: results.validateResultsClimbing,
        format: format.validateFormatClimbing,
        formatOptions: format.validateFormatOptionsClimbing,
      };
    case 'ice-skating':
      return {
        results: results.validateResultsIceSkating,
        format: format.validateFormatIceSkating,
        formatOptions: format.validateFormatOptionsIceSkating,
      };
    default:
      return fallthrough(sport);
  }
};

export const getCheckers = (sport: LiteralUnion<Sport, string>) => {
  switch (sport) {
    case 'climbing':
      return {
        results: results.isResultsClimbing,
        format: format.isFormatClimbing,
        formatOptions: format.isFormatOptionsClimbing,
      };
    case 'ice-skating':
      return {
        results: results.isResultsIceSkating,
        format: format.isFormatIceSkating,
        formatOptions: format.isFormatOptionsIceSkating,
      };
    default:
      return fallthrough(sport);
  }
};
