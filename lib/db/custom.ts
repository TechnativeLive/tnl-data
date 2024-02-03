import { Simplify } from 'type-fest';
import { TimerEvent } from '../timer/utils';

/**
 * Sounds Jsonb type is enforced via contraint (check_sounds) in the database
 */
export type DbTimer = Simplify<
  Omit<Tables<'timers'>, 'sounds'> & {
    sounds: Record<TimerEvent | number, string>;
  }
>;
