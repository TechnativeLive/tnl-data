'use client'

import { SimpleForm, SimpleFormAction } from '@/components/forms/simple-form'
import { SubmitButton } from '@/components/forms/submit-button'
import { countrySelectionCode2 } from '@/lib/countries/countries'
import { createBrowserClient } from '@/lib/db/client'
import { Json } from '@/lib/db/types'
import { TextInput, Select, JsonInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendarDue } from '@tabler/icons-react'
import clsx from 'clsx'
import { Suspense, useEffect, useState } from 'react'
import { headshotDest } from '@/app/(app-shell)/entrants/utils'
import { PhotoDropzone } from '@/app/(app-shell)/entrants/tabs/edit/photo-dropzone'
import { PrimarySportSelection } from '@/app/(app-shell)/entrants/tabs/primary-sport-selection'

export function EditEntrantForm({
  entrants,
  action,
}: {
  entrants: Tables<'entrants'>[]
  action: SimpleFormAction<Json>
}) {
  const entrantsAsOptions =
    entrants?.map((entrant) => ({
      label: `[${entrant.id.toString().padStart(4, " ")}] ${entrant.first_name} ${entrant.last_name}`,
      value: entrant.id.toString(),
    })) ?? []
  const [selectedEditEntrant, setSelectedEditEntrant] = useState<Tables<'entrants'> | undefined>(
    undefined,
  )

  const [firstName, setFirstName] = useState<string | undefined>(undefined)
  const [lastName, setLastName] = useState<string | undefined>(undefined)
  const [nickName, setNickName] = useState<string | undefined | null>(undefined)
  const [country, setCountry] = useState<string | undefined | null>(undefined)
  const [dob, setDob] = useState<string | undefined | null>(undefined)
  const [data, setData] = useState<string | undefined>(undefined)
  const [primarySport, setPrimarySport] = useState<number | undefined>(undefined)

  useEffect(() => {
    setFirstName(selectedEditEntrant?.first_name)
    setLastName(selectedEditEntrant?.last_name)
    setNickName(selectedEditEntrant?.nick_name)
    setCountry(selectedEditEntrant?.country)
    setDob(selectedEditEntrant?.dob)
    setData(JSON.stringify(selectedEditEntrant?.data))
    setPrimarySport(selectedEditEntrant?.primary_sport ?? undefined)
    setPhoto(selectedEditEntrant?.photo ?? undefined)
  }, [selectedEditEntrant])

  const [photo, setPhoto] = useState<string | undefined>(undefined)

  const photoDest = headshotDest(selectedEditEntrant)

  return (
    <SimpleForm action={action} reset>
      <Select
        className="grow mb-lg"
        placeholder="Select an entrant to edit"
        fw={700}
        searchable
        clearable={false}
        allowDeselect={false}
        name="id"
        data={entrantsAsOptions}
        onChange={(value) => setSelectedEditEntrant(entrants.find((e) => e.id === Number(value)))}
      />
      <div
        className={clsx(
          'grid overflow-hidden transition-[grid-template-rows] duration-500',
          selectedEditEntrant ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div
          className={clsx(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm transition-[visibility] duration-500 min-h-0',
            selectedEditEntrant ? 'visible' : 'invisible',
          )}
        >
          <TextInput
            required
            label="First Name"
            name="first_name"
            value={firstName || ''}
            onChange={(v) => setFirstName(v.currentTarget.value)}
          />
          <TextInput
            required
            label="Last Name"
            name="last_name"
            value={lastName || ''}
            onChange={(v) => setLastName(v.currentTarget.value)}
          />
          <TextInput
            label="Nickname"
            name="nick_name"
            value={nickName || ''}
            onChange={(v) => setNickName(v.currentTarget.value)}
          />
          <TextInput label="ID" value={selectedEditEntrant?.id} />
          <DatePickerInput
            label="Date of Birth"
            name="dob"
            rightSection={<IconCalendarDue />}
            rightSectionPointerEvents="none"
            value={dob ? new Date(dob) : undefined}
            onChange={(v) => setDob(v?.toISOString().split('T')[0] ?? undefined)}
          />

          <PhotoDropzone dest={photoDest} value={photo} onChange={setPhoto} />

          <Select
            label="Country"
            name="country"
            data={countrySelectionCode2}
            defaultValue="GB"
            autoComplete="off"
            searchable
            value={country}
            onChange={setCountry}
          />
          <Suspense fallback={<Select />}>
            <PrimarySportSelection
              value={primarySport}
              onChange={(v) => (v ? Number(v) : undefined)}
            />
          </Suspense>
          <JsonInput
            label="Custom Data"
            name="data"
            minRows={1}
            autosize
            formatOnBlur
            variant="default"
            validationError="Invalid JSON (use double-quotes, remove trailing commas)"
            value={data}
            onChange={setData}
            className="col-span-2"
          />
          <SubmitButton
            className="self-end max-lg:mt-8 col-span-full"
            type="submit"
            variant="filled"
            disabled={!!data && !isDataValidJson(data)}
          >
            Update
          </SubmitButton>
        </div>
      </div>
    </SimpleForm>
  )
}

function isDataValidJson(data: string): boolean {
  try {
    JSON.parse(data)
    return true
  } catch {
    return false
  }
}
