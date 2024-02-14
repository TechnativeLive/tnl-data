'use server';

import { FormState } from '@/components/forms/simple-form';
import { createServerActionClient } from '@/lib/db/server-action';
import { Json } from '@/lib/db/types';
import { toNumOrNull } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function createEntrant(
  _prevState: FormState<Json>,
  formData: FormData,
): Promise<FormState<Json>> {
  const supabase = createServerActionClient();

  const data = String(formData.get('data'));
  const dataAsJson: Json = data ? JSON.parse(data) : null;

  const entrant = {
    first_name: String(formData.get('first_name')),
    last_name: String(formData.get('last_name')),
    nick_name: String(formData.get('nick_name')) || null,
    country: String(formData.get('country')) || null,
    dob: String(formData.get('dob')) || null,
    data: dataAsJson || null,
    primary_sport: toNumOrNull(formData.get('primary_sport')),
  } satisfies Partial<Tables<'entrants'>>;

  try {
    const { data, error } = await supabase.from('entrants').insert(entrant).select('id').single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/entrants');
    return { success: true, message: `Entrant added, id ${data.id}`, data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}
