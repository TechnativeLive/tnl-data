'use server';

import { EventFormat } from '@/lib/event-data';
import { createServerActionClient } from '@/lib/db/server-action';
import { Json } from '@/lib/db/types';
import { isObject, toNumOrZero } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

type FormState = {
  message: string | null;
  success: boolean;
  data?: Json;
};

/**
 * @requires event
 * @requires format
 * @requires results
 * @optional name
 * @optional ds_keys
 * @optional starts_at
 * @optional ends_at
 * @optional sport
 */
export async function updateEvent(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerActionClient();
  const sport = formData.get('sport');
  const event = formData.get('event');

  const name = formData.get('name')?.toString();
  const format = formData.get('format')?.toString();
  const ds_keys = formData.get('ds_keys')?.toString();
  const starts_at = formData.get('starts_at')?.toString() || null;
  const ends_at = formData.get('ends_at')?.toString() || null;
  const timersString = formData.get('timers')?.toString();
  const timers = timersString ? timersString.split(',').map(toNumOrZero) : null;

  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };

  try {
    const validFormat = JSON.parse(format) as Json;
    const { data, error } = await supabase
      .from('events')
      .update({ format: validFormat, starts_at, ends_at, name, ds_keys, timers })
      .eq('slug', event)
      .select('format')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Event updated', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

/**
 * @requires event
 * @requires format
 * @requires results
 * @optional sport
 */
export async function takeSnapshot(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerActionClient();
  const now = new Date().toISOString();
  const sport = formData.get('sport');
  const event = formData.get('event');
  const format = formData.get('format')?.toString();
  const results = formData.get('results')?.toString();

  if (!format) return { success: false, message: 'No format provided' };
  if (!results) return { success: false, message: 'No results provided' };
  if (!event) return { success: false, message: 'No event provided' };

  try {
    const validFormat = JSON.parse(format) as Json;
    const validResults = JSON.parse(results) as Json;
    const { data, error } = await supabase
      .from('events')
      .update({ snapshot: { format: validFormat, results: validResults, created_at: now } })
      .eq('slug', event)
      .select('snapshot');

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Snapshot created', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

/**
 * @requires event
 * @requires snapshot
 * @optional sport
 */
export async function restoreFromSnapshot(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = createServerActionClient();
  const sport = formData.get('sport');
  const event = formData.get('event');
  const snapshot = formData.get('snapshot')?.toString();

  if (!snapshot) return { success: false, message: 'No snapshot provided' };
  if (!event) return { success: false, message: 'No event provided' };

  try {
    const validSnapshot = JSON.parse(snapshot) as Json;
    if (!isObject(validSnapshot) || !('format' in validSnapshot) || !('results' in validSnapshot)) {
      return { success: false, message: 'Invalid snapshot provided' };
    }

    const { format, results } = validSnapshot;

    const { data, error } = await supabase
      .from('events')
      .update({ format, results })
      .eq('slug', event)
      .select('snapshot')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Snapshot restored', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

/**
 * @requires event
 * @optional sport
 */
export async function deleteSnapshot(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = createServerActionClient();
  const sport = formData.get('sport');
  const event = formData.get('event');

  if (!event) return { success: false, message: 'No event provided' };

  try {
    const { error } = await supabase
      .from('events')
      .update({ snapshot: null })
      .eq('slug', event)
      .select('snapshot');

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Snapshot deleted' };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

// TODO: uses saved event data, not local state of format
export async function populateFormatEntrants(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = createServerActionClient();
  const format = formData.get('format')?.toString();
  const event = formData.get('event');
  const sport = formData.get('sport');

  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };

  try {
    const validFormat = JSON.parse(format) as Partial<EventFormat<'ice-skating'>>;
    const entrantIds = validFormat?.rounds
      ?.flatMap((round) => round?.classes?.map((cls) => cls?.entrants))
      .flat()
      .filter((entrant) => typeof entrant === 'number') as number[] | undefined;

    if (!entrantIds) {
      return { success: false, message: 'Unexpected structure of format' };
    }

    if (entrantIds.length === 0) {
      return { success: true, message: 'All entrants were already populated' };
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

    const { data, error } = await supabase
      .from('events')
      .update({ format: populatedFormat })
      .eq('slug', event)
      .select('format')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Event updated', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

export async function updateFormatEntrants(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = createServerActionClient();
  const format = formData.get('format')?.toString();
  const event = formData.get('event');
  const sport = formData.get('sport');

  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };

  try {
    const validFormat = JSON.parse(format) as Partial<EventFormat<'ice-skating'>>;
    const entrantIds = validFormat?.rounds
      ?.flatMap((round) => round?.classes?.map((cls) => cls?.entrants))
      .flat()
      .map((entrant) => (typeof entrant === 'number' ? entrant : entrant?.id));

    if (!entrantIds) {
      return { success: false, message: 'Unexpected structure of format' };
    }

    if (entrantIds.length === 0) {
      return { success: true, message: 'All entrants were already populated' };
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

    const { data, error } = await supabase
      .from('events')
      .update({ format: updatedFormat })
      .eq('slug', event)
      .select('format')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Event updated', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

export async function depopulateFormatEntrants(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = createServerActionClient();
  const format = formData.get('format')?.toString();
  const event = formData.get('event');
  const sport = formData.get('sport');

  if (!format) return { success: false, message: 'No format provided' };
  if (!event) return { success: false, message: 'No event provided' };

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
      return { success: true, message: 'All entrants were already depopulated' };
    }

    const depopulatedFormat = { ...validFormat, rounds: depopulatedRounds };

    const { data, error } = await supabase
      .from('events')
      .update({ format: depopulatedFormat })
      .eq('slug', event)
      .select('format')
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidateEventPages({ event, sport });
    return { success: true, message: 'Event updated', data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

function revalidateEventPages({
  event,
  sport,
}: {
  event: string | FormDataEntryValue;
  sport?: string | FormDataEntryValue | null;
}) {
  const invalidatedPath = sport ? `/${sport}/${event}/edit` : '/';
  revalidatePath(invalidatedPath);
}
