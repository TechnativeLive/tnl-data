'use server';

import { FormState } from '@/components/forms/simple-form';
import { createServerActionClient } from '@/lib/db/server-action';
import { datastreamKeys } from '@/lib/singular/datastream';
import { toNumOr } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function createDatastream(
  _prevState: FormState<Tables<'ds_keys'>>,
  formData: FormData,
): Promise<FormState<Tables<'ds_keys'>>> {
  const supabase = createServerActionClient();

  const name: Parameters<typeof datastreamKeys.create>[0] = String(formData.get('name'));

  try {
    const { data: singularData, error: singularError } = await datastreamKeys.create(name);
    if (singularError) {
      return { success: false, message: singularError.message };
    }

    const kind: Tables<'ds_keys'>['kind'] =
      String(formData.get('kind')) === 'timer' ? 'timer' : 'data';
    const record: DbInsert<'ds_keys'> = {
      name,
      kind,
      description: String(formData.get('description')),
      private: singularData.private_token,
      public: singularData.public_token,
      id: singularData.id,
    };

    const { data, error } = await supabase.from('ds_keys').insert(record).select().single();

    if (error) {
      const { error: deleteError } = await datastreamKeys.delete(singularData.id);
      if (deleteError) {
        return {
          success: false,
          message: `Datastream created, but failed to delete from Singular: ${error.message}`,
        };
      }
      return { success: false, message: error.message };
    }

    revalidatePath('/datastreams');
    return { success: true, message: `Datastream ${data.name} added`, data };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}

export async function deleteDatastream(
  _prevState: FormState<Tables<'ds_keys'>>,
  formData: FormData,
): Promise<FormState<Tables<'ds_keys'>>> {
  const supabase = createServerActionClient();

  const id = toNumOr(formData.get('id'), undefined);
  if (!id) {
    return { success: false, message: 'ID is required when deleting a datastream' };
  }

  try {
    const { error: singularError } = await datastreamKeys.delete(id);
    if (singularError) {
      return { success: false, message: singularError.message };
    }

    const { error } = await supabase.from('ds_keys').delete().eq('id', id);
    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/datastreams');
    return { success: true, message: `Datastream deleted` };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}
