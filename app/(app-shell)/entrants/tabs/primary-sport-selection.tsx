import { createBrowserClient } from '@/lib/db/client'
import { Select } from '@mantine/core'
import { useState, useEffect } from 'react'

export function PrimarySportSelection({
  value,
  onChange,
}: {
  value: number | undefined
  onChange: (v: string | null) => void
}) {
  const supabase = createBrowserClient()
  const [data, setData] = useState<Pick<Tables<'sports'>, 'id' | 'name'>[]>([])

  useEffect(() => {
    const update = async () => {
      const { data: sportsData } = await supabase.from('sports').select('id, name')
      if (sportsData) setData(sportsData)
    }
    update()
  }, [supabase])
  const options = (data ?? []).map((sport) => ({ value: sport.id.toString(), label: sport.name }))

  return (
    <Select
      disabled={!data}
      label="Primary Sport"
      name="primary_sport"
      data={options}
      defaultValue="3"
      value={value?.toString()}
      onChange={onChange}
    />
  )
}
