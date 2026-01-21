import { createServerActionClient } from '@/lib/db/server-action'
import type { NextRequest } from 'next/server'

type SingularSelectionJson = { id: string; title: string }[]

export async function GET(_req: NextRequest) {
  const supabase = createServerActionClient()

  const { data: dsKeys, error } = await supabase
    .from('ds_keys')
    .select('name, kind, description, public, private, id')
    .order('name', { ascending: true })

  if (error) {
    return Response.error()
  }

  const json: SingularSelectionJson = dsKeys.map((ds) => ({
    id: ds.public,
    title: ds.name,
  }))

  return Response.json(json)
}
