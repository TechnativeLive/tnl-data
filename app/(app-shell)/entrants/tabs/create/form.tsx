import { PhotoDropzoneSSR } from '@/app/(app-shell)/entrants/tabs/create/photo-dropzone-ssr'
import { SimpleForm, SimpleFormAction } from '@/components/forms/simple-form'
import { SubmitButton } from '@/components/forms/submit-button'
import { countrySelectionCode2 } from '@/lib/countries/countries'
import { createServerClient } from '@/lib/db/server'
import { Json } from '@/lib/db/types'
import { TextInput, Select, JsonInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendarDue } from '@tabler/icons-react'
import { Suspense } from 'react'

export function CreateEntrantForm({ action }: { action: SimpleFormAction<Json> }) {
  return (
    <SimpleForm action={action} reset>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm">
        <TextInput required label="First Name" name="first_name" />
        <TextInput required label="Last Name" name="last_name" />
        <TextInput label="Nickname" name="nick_name" />
        <DatePickerInput
          label="Date of Birth"
          name="dob"
          rightSection={<IconCalendarDue />}
          rightSectionPointerEvents="none"
        />
        <Select
          label="Country"
          name="country"
          data={countrySelectionCode2}
          defaultValue="GB"
          autoComplete="off"
          searchable
        />
        <PhotoDropzoneSSR />
        <Suspense fallback={<Select />}>
          <PrimarySportSelection />
        </Suspense>
        <JsonInput
          label="Custom Data"
          name="data"
          minRows={1}
          autosize
          formatOnBlur
          variant="default"
          validationError="Invalid JSON (use double-quotes, remove trailing commas)"
        />
        <SubmitButton className="self-end max-lg:mt-8 col-span-full" type="submit" variant="filled">
          Create
        </SubmitButton>
      </div>
    </SimpleForm>
  )
}

async function PrimarySportSelection() {
  const supabase = createServerClient()
  const { data } = await supabase.from('sports').select('id, name')
  const options = (data ?? []).map((sport) => ({ value: sport.id.toString(), label: sport.name }))

  return (
    <Select
      disabled={!data}
      label="Primary Sport"
      name="primary_sport"
      data={options}
      defaultValue="3"
    />
  )
}
