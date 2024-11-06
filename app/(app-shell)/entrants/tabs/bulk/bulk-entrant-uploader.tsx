'use client'

import {
  Box,
  Button,
  Checkbox,
  Grid,
  GridCol,
  Group,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableThead,
  TableTr,
  Text,
} from '@mantine/core'
import { useCallback, useState } from 'react'
import clip from 'clipboardy'
import { notifications } from '@mantine/notifications'
import { PrimarySportSelection } from '@/app/(app-shell)/entrants/tabs/primary-sport-selection'
import { SubmitButton } from '@/components/forms/submit-button'
import { Select } from '@/components/select'
import { createBrowserClient } from '@/lib/db/client'
import dayjs from 'dayjs'

function convertPastedData(data: string): string[][] {
  const values = data.split(/\n|\r\n/).map((line) => line.split(/\t/))
  const secondLastRow = values[values.length - 2]

  if (!values.length || (values.length === 1 && !values[0]?.length)) {
    notifications.show({
      color: 'red',
      title: 'Error',
      message: 'No data found in clipboard',
    })
    return []
  }

  // Ensure we don't have hanging values - fill them with empty strings
  if (secondLastRow && values[values.length - 1]?.length !== secondLastRow?.length) {
    values[values.length - 1] =
      secondLastRow?.map((_, i) => values[values.length - 1]?.[i] ?? '') ?? []
  }

  return values
}

const validation = (
  sport: number | undefined,
  headers: (string | null)[],
  selectedRows: number[],
) => {
  let errors: string[] = []
  if (sport === undefined) errors.push('Primary Sport is required')
  if (!headers.includes('first_name')) errors.push('First Name is required')
  if (!headers.includes('last_name')) errors.push('Last Name is required')
  if (selectedRows.length === 0) errors.push('No rows selected')
  return errors
}

async function bulkInsert(
  validated: boolean,
  sport: number,
  headers: (string | null)[],
  data: string[][],
  selectedRows: number[],
) {
  if (!validated) return { error: { message: 'Fix the validation errors first' } }

  const supabase = createBrowserClient()

  const rows = data
    .filter((_, i) => selectedRows.includes(i))
    .map((row) => {
      const cells = row
        .filter((_, i) => headers[i])
        .map((cell, i) => {
          const header = headers[i] as string
          let value = cell.trim() || null

          try {
            if (header === 'dob' && value) {
              const date = dayjs(value, 'MM/DD/YYYY')
              value = date.isValid() ? date.format('YYYY-MM-DD') : null
            }
            if (header === 'data' && value) value = JSON.parse(value)
          } catch (error) {
            console.log(error)
            value = null
          }

          return [header, value]
        })
        .filter((v) => !!v)

      return Object.fromEntries([...cells, ['primary_sport', sport]])
    }) as Record<'first_name' | 'last_name', string>[]

  console.log({ rows })
  const { data: insertData, error } = await supabase.from('entrants').insert(rows).select('*')

  return { data: insertData, error }
}

export function BulkEntrantUploader() {
  const [loading, setLoading] = useState(false)
  const [headers, setHeaders] = useState<(string | null)[]>([])
  const [data, setData] = useState<string[][]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [sport, setSport] = useState(3) // defaults to climbing

  const paste = useCallback(async () => {
    const clipboardData = await clip.read()
    const data = convertPastedData(clipboardData)
    setData(data)
    setSelectedRows(data.map((_, i) => i))
  }, [setData])

  const colCount = data[0]?.length || 0
  const cols = Array.from({ length: colCount }).map((_, i) => i)

  const errors = validation(sport, headers, selectedRows)
  const validated = errors.length === 0 && data.length > 0

  async function upload() {
    setLoading(true)
    const { data: insertData, error } = await bulkInsert(
      validated,
      sport,
      headers,
      data,
      selectedRows,
    )
    console.log({ insertData, error })

    if (error) {
      notifications.show({ color: 'red', title: 'Error', message: error.message })
    } else {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Data uploaded successfully',
      })
      setData([])
    }
    setLoading(false)
  }

  return (
    <Stack gap="md">
      <Text>
        This tool lets you bulk upload new entrants. It is designed to support copy & paste from a
        google sheet, but it supports any data in TSV format.{' '}
        <Text component="span" fw="bold">
          First and Lastnames are required.{' '}
        </Text>
        DOB should be formatted dd-mm-yyyy, and Custom data should be in JSON format.
        <Text c="orange" py="sm">
          Warning: Bulk insert will always create new entrants, even if an entrant with matching
          first and lastnames already exists
        </Text>
      </Text>
      <Grid grow>
        <GridCol span={6} className="flex flex-col justify-between gap-sm">
          <Box className="bg-[var(--mantine-color-indigo-light)] p-4 rounded pr-8">
            <Group align="center" wrap="nowrap">
              <Text
                className="bg-gray-9 h-6 w-6 rounded-full flex items-center justify-center"
                c="indigo.3"
                fz="sm"
              >
                1
              </Text>
              <Text fw="bold" c="indigo.3" fz="sm">
                Select a Sport
              </Text>
            </Group>
          </Box>

          <PrimarySportSelection value={sport} onChange={(v) => v && setSport(Number(v))} />
        </GridCol>

        <GridCol span={6} className="flex flex-col justify-between gap-sm">
          <Box className="bg-[var(--mantine-color-indigo-light)] p-4 rounded pr-8">
            <Group align="center" wrap="nowrap">
              <Text
                className="bg-gray-9 h-6 w-6 rounded-full flex items-center justify-center"
                c="indigo.3"
                fz="sm"
              >
                2
              </Text>
              <Text fw="bold" c="indigo.3" fz="sm">
                Paste from clipboard
              </Text>
            </Group>
          </Box>
          <Button disabled={loading} onClick={paste}>
            Click to paste
          </Button>
        </GridCol>

        <GridCol span={12} className="flex flex-col justify-between gap-sm pt-6">
          <Box className="bg-[var(--mantine-color-indigo-light)] p-4 rounded pr-8">
            <Group align="center" wrap="nowrap">
              <Text
                className="bg-gray-9 h-6 w-6 rounded-full flex items-center justify-center"
                c="indigo.3"
                fz="sm"
              >
                3
              </Text>
              <Text fw="bold" c="indigo.3" fz="sm">
                Verify your data & select headers
              </Text>
            </Group>
          </Box>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <TableThead>
              <TableTr>
                {cols.length > 0 && (
                  <TableTd>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        aria-label="Select all rows"
                        checked={selectedRows.length === data.length}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                        onChange={(event) =>
                          setSelectedRows(event.currentTarget.checked ? data.map((_, i) => i) : [])
                        }
                      />
                    </div>
                  </TableTd>
                )}
                {cols.map((col) => (
                  <TableTd key={col}>
                    <HeaderCell
                      others={headers}
                      value={headers[col] || null}
                      onChange={(v) =>
                        setHeaders((prev) => {
                          const newHeaders = [...prev]
                          newHeaders[col] = v
                          return newHeaders
                        })
                      }
                    />
                  </TableTd>
                ))}
              </TableTr>
            </TableThead>
            <TableTbody>
              {data.map((row, rowIndex) => (
                <TableTr key={rowIndex}>
                  <TableTd>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        aria-label="Select row"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={(event) =>
                          setSelectedRows(
                            event.currentTarget.checked
                              ? [...selectedRows, rowIndex]
                              : selectedRows.filter((position) => position !== rowIndex),
                          )
                        }
                      />
                    </div>
                  </TableTd>
                  {row.map((cell, cellIndex) => (
                    <TableTd key={cellIndex}>{cell}</TableTd>
                  ))}
                </TableTr>
              ))}
            </TableTbody>
          </Table>
        </GridCol>
      </Grid>

      <SubmitButton type="submit" variant="filled" disabled={!validated} onClick={upload}>
        Bulk upload
      </SubmitButton>

      {errors.length > 0 && data.length > 0 && (
        <div className="flex flex-col items-center">
          {errors.map((error, i) => (
            <Text key={i} fz="sm" c="red.6" fs="italic" fw="bold">
              {error}
            </Text>
          ))}
        </div>
      )}
    </Stack>
  )
}

const headerOptions: {
  label: string
  value: string
}[] = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Nickname', value: 'nick_name' },
  { label: 'Date of Birth', value: 'dob' },
  { label: 'Country', value: 'country' },
  { label: 'Custom Data', value: 'data' },
]
function HeaderCell({
  others,
  value,
  onChange,
}: {
  others: (string | null)[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <Select
      required
      data={headerOptions.filter(
        (option) => option.value === value || !others.includes(option.value),
      )}
      placeholder="Select header"
      value={value}
      onChange={onChange}
    />
  )
}
