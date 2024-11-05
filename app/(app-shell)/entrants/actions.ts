'use server'

import { headshotAbsoluteUrl, headshotDest } from '@/app/(app-shell)/entrants/utils'
import { FormState } from '@/components/forms/simple-form'
import { createServerActionClient } from '@/lib/db/server-action'
import { Json } from '@/lib/db/types'
import { toNumOrNull } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function createEntrant(
  _prevState: FormState<Json>,
  formData: FormData,
): Promise<FormState<Json>> {
  const supabase = createServerActionClient()

  const data = String(formData.get('data'))
  const dataAsJson: Json = data ? JSON.parse(data) : null

  const idAsNum = Number(formData.get('id') || Number.NaN)
  const id = Number.isNaN(idAsNum) ? undefined : idAsNum

  const photoRaw = formData.get('photo')

  const entrant = {
    id,
    first_name: String(formData.get('first_name')),
    last_name: String(formData.get('last_name')),
    nick_name: String(formData.get('nick_name')) || null,
    country: String(formData.get('country')) || null,
    dob: String(formData.get('dob')) || null,
    data: dataAsJson || null,
    primary_sport: toNumOrNull(formData.get('primary_sport')),
    ...(typeof photoRaw === 'string' ? { photo: photoRaw } : {}),
  } satisfies Partial<Tables<'entrants'>>

  try {
    const { data, error } = await supabase
      .from('entrants')
      .upsert(entrant)
      .select('id, first_name, last_name')
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    if (photoRaw instanceof File) {
      const { data: headshotData, error: headshotError } = await uploadHeadshot(
        photoRaw,
        headshotDest(data)!,
      )

      if (headshotError || !headshotData) {
        return { success: false, message: headshotError?.message || 'Error uploading headshot' }
      }

      const { error: updatedEntrantError } = await supabase
        .from('entrants')
        .update({ photo: headshotAbsoluteUrl(headshotData.path) })
        .eq('id', data.id)

      if (updatedEntrantError) {
        return { success: false, message: updatedEntrantError.message }
      }
    }

    revalidatePath('/entrants')
    return { success: true, message: `Entrant ${id ? 'updated' : 'added'}, id ${data.id}`, data }
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error occurred',
    }
  }
}

async function uploadHeadshot(file: File, dest: string) {
  const supabase = createServerActionClient()
  const { data, error } = await supabase.storage.from('headshots').upload(dest, file, {
    cacheControl: '3600',
    upsert: true,
  })
  return { data, error }
}
