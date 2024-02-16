import { createBrowserClient } from '@/lib/db/client';
import { EventFormat, Sport } from '@/lib/event-data';
import { getValidators } from '@/lib/json/functions';

type PopulateFormatProps = {
  format?: string;
  event?: string;
  sport?: string;
};

type PopulateFormatResponse =
  | {
      success: false;
      message: string;
      data?: undefined;
    }
  | {
      success: true;
      message: string;
      data: string;
    };

export async function populateFormatEntrants({
  format,
  event,
  sport,
}: PopulateFormatProps): Promise<PopulateFormatResponse> {
  const supabase = createBrowserClient();
  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };
  if (!sport) return { success: false, message: 'No sport provided' };

  try {
    const validFormat = JSON.parse(format) as Partial<EventFormat<Sport>>;
    const entrantIds = validFormat?.rounds
      ?.flatMap((round) => round?.classes?.map((cls) => cls?.entrants))
      .flat()
      .filter((entrant) => typeof entrant === 'number') as number[] | undefined;

    if (!entrantIds) {
      return { success: false, message: 'Unexpected structure of format' };
    }

    if (entrantIds.length === 0) {
      return { success: false, message: 'All entrants were already populated' };
    }

    const uniqueIds = [...new Set(entrantIds)];

    const entrants = await supabase
      .from('entrants')
      .select('id, dob, first_name, last_name, nick_name, country, data')
      .in('id', uniqueIds);

    const entrantMap = entrants.data?.reduce(
      (acc, entrant) => {
        acc[entrant.id] = entrant;
        return acc;
      },
      {} as Record<string, any>,
    );

    if (!entrantMap) {
      return { success: false, message: 'No entrants found' };
    }

    const populatedRounds = validFormat?.rounds?.map((round) => ({
      ...round,
      classes: round.classes.map((cls) => ({
        ...cls,
        entrants: cls.entrants.map((entrant) =>
          typeof entrant === 'number' ? entrantMap[entrant] : entrant,
        ),
      })),
    }));
    const populatedFormat = { ...validFormat, rounds: populatedRounds };

    const validator = getValidators(sport).format;
    const { errors, success } = validator(populatedFormat);

    if (!success) {
      return {
        success: false,
        message: `Invalid format: ${errors.map((error) => `@ ${error.path}, got ${error.value} instead of ${error.expected}`).join('\n')}`,
      };
    }

    return {
      success: true,
      message: 'Event updated',
      data: JSON.stringify(populatedFormat, null, 2),
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

export async function updateFormatEntrants({
  format,
  event,
  sport,
}: PopulateFormatProps): Promise<PopulateFormatResponse> {
  const supabase = createBrowserClient();
  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };
  if (!sport) return { success: false, message: 'No sport provided' };

  try {
    const validFormat = JSON.parse(format) as Partial<EventFormat<Sport>>;
    const entrantIds = validFormat?.rounds
      ?.flatMap((round) => round?.classes?.map((cls) => cls?.entrants))
      .flat()
      .map((entrant) => (typeof entrant === 'number' ? entrant : entrant?.id));

    if (!entrantIds) {
      return { success: false, message: 'Unexpected structure of format' };
    }

    if (entrantIds.length === 0) {
      return { success: false, message: 'No entrants found, no update required' };
    }

    const uniqueIds = [...new Set(entrantIds)];

    const entrants = await supabase
      .from('entrants')
      .select('id, dob, first_name, last_name, nick_name, country, data')
      .in('id', uniqueIds);

    const entrantMap = entrants.data?.reduce(
      (acc, entrant) => {
        acc[entrant.id] = entrant;
        return acc;
      },
      {} as Record<string, any>,
    );

    if (!entrantMap) {
      return { success: false, message: 'No entrants found' };
    }

    const updatedRounds = validFormat?.rounds?.map((round) => ({
      ...round,
      classes: round.classes.map((cls) => ({
        ...cls,
        entrants: cls.entrants.map((entrant) =>
          typeof entrant === 'number' ? entrantMap[entrant] : entrant,
        ),
      })),
    }));
    const updatedFormat = { ...validFormat, rounds: updatedRounds };

    const validator = getValidators(sport).format;
    const { errors, success } = validator(updatedFormat);

    if (!success) {
      return {
        success: false,
        message: `Invalid format: ${errors.map((error) => `@ ${error.path}, got ${error.value} instead of ${error.expected}`).join('\n')}`,
      };
    }

    return {
      success: true,
      message: 'Event updated',
      data: JSON.stringify(updatedFormat, null, 2),
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

export function depopulateFormatEntrants({
  format,
  event,
  sport,
}: PopulateFormatProps): PopulateFormatResponse {
  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };
  if (!sport) return { success: false, message: 'No sport provided' };

  try {
    const validFormat = JSON.parse(format) as Partial<EventFormat<'ice-skating'>>;

    const depopulatedRounds = validFormat?.rounds?.map((round) => ({
      ...round,
      classes: round?.classes?.map((cls) => ({
        ...cls,
        entrants: cls.entrants.map((entrant) =>
          typeof entrant === 'object' ? entrant.id : entrant,
        ),
      })),
    }));

    if (!depopulatedRounds) {
      return { success: false, message: 'Unexpected structure of format' };
    }

    if (depopulatedRounds.length === 0) {
      return { success: false, message: 'All entrants were already depopulated' };
    }

    const depopulatedFormat = { ...validFormat, rounds: depopulatedRounds };

    const validator = getValidators(sport).format;
    const { errors, success } = validator(depopulatedFormat);

    if (!success) {
      return {
        success: false,
        message: `Invalid format: ${errors.map((error) => `@ ${error.path}, got ${error.value} instead of ${error.expected}`).join('\n')}`,
      };
    }
    return {
      success: true,
      message: 'Event updated',
      data: JSON.stringify(depopulatedFormat, null, 2),
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}
