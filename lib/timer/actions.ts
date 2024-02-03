'use server';

import { DbTimer } from '@/lib/db/custom';
import { createServerActionClient } from '@/lib/db/server-action';
import { revalidatePath } from 'next/cache';

export async function createTimer() {
  const supabase = createServerActionClient();
  const { error } = await supabase.from('timers').insert({}).select();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidatePath('/timers');
  return { success: true, message: null };
}

export async function updateTimer(timerUpdate: Partial<DbTimer> & { id: DbTimer['id'] }) {
  const supabase = createServerActionClient();
  const { error } = await supabase.from('timers').update(timerUpdate).eq('id', timerUpdate.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidatePath('/timers');
  return { success: true, message: null };
}

export async function deleteTimer(id: number) {
  const supabase = createServerActionClient();
  const { error } = await supabase.from('timers').delete().eq('id', id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidatePath('/timers');
  return { success: true, message: null };
}

export async function syncTimer(timer: DbTimer, signal?: AbortSignal) {
  const supabase = createServerActionClient();

  const { error } = signal
    ? await supabase
        .from('timers')
        .upsert(timer, { onConflict: 'id', ignoreDuplicates: false })
        .abortSignal(signal)
    : await supabase.from('timers').upsert(timer, { onConflict: 'id', ignoreDuplicates: false });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidatePath('/timers');
  return { success: true, message: null };
}

// Note: all timer control functions will set timer.UTC to the current time.
// Also all functions sync with the database before returning
