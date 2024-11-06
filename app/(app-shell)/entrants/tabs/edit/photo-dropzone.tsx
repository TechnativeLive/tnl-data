'use client'

import { convertToBase64, headshotAbsoluteUrl } from '@/app/(app-shell)/entrants/utils'
import { createBrowserClient } from '@/lib/db/client'
import { InputLabel, Group, rem, Text } from '@mantine/core'
import { Dropzone, DropzoneAccept, DropzoneReject, DropzoneIdle } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react'
import { useState, useRef } from 'react'

export function PhotoDropzone({
  dest,
  value,
  onChange,
}: {
  dest?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const [dropzoneLoading, setDropzoneLoading] = useState(false)
  const [photoRaw, setPhotoRaw] = useState<string | undefined>(undefined)

  return (
    <div className="row-span-4 lg:row-span-5 col-end-[-1] row-start-1">
      <InputLabel onClick={() => dropzoneRef.current?.focus()}>Photo</InputLabel>
      <input type="hidden" name="photo" value={value || ''} />
      <Dropzone
        ref={dropzoneRef}
        loading={dropzoneLoading}
        multiple={false}
        onDrop={async ([file]) => {
          if (!file || !dest) {
            notifications.show({
              color: 'red',
              title: 'Error',
              message: 'No file / entrant selected',
            })
            return
          }

          convertToBase64(file).then((result) => {
            setPhotoRaw(result)
          })

          setDropzoneLoading(true)
          const { data, error } = await uploadHeadshot(file, dest)
          setDropzoneLoading(false)

          if (error || !data) {
            notifications.show({
              color: 'red',
              title: 'Error',
              message: error?.message ?? 'Error uploading file',
            })
            return
          }

          onChange?.(headshotAbsoluteUrl(data.path))
          notifications.show({
            color: 'green',
            title: 'Uploaded',
            message: `File uploaded - ${data?.path}`,
          })
        }}
        onReject={(files) =>
          notifications.show({
            color: 'red',
            title: 'Rejected',
            message: [
              'Rejected files:',
              ...files.map((f) => `${f.file.name} - ${f.errors.join(', ')}`),
            ].join('\n'),
          })
        }
        maxSize={5 * 1024 ** 2}
        accept={['image/png', 'image/jpeg', 'image/webp']}
      >
        <Group justify="center" py="xl" gap="sm" mih={220} style={{ pointerEvents: 'none' }}>
          {value || photoRaw ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoRaw || value || undefined}
                alt="Headshot"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <>
              <DropzoneAccept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-blue-6)',
                  }}
                  stroke={1.5}
                />
              </DropzoneAccept>
              <DropzoneReject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-red-6)',
                  }}
                  stroke={1.5}
                />
              </DropzoneReject>
              <DropzoneIdle>
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-dimmed)',
                  }}
                  stroke={1.5}
                />
              </DropzoneIdle>

              <div>
                <Text size="xl" inline>
                  Drag image here or click to select file
                </Text>
                <Text size="sm" c="dimmed" inline mt={7} ta="center">
                  Maximum filesize of 5mb
                </Text>
              </div>
            </>
          )}
        </Group>
      </Dropzone>
    </div>
  )
}

async function uploadHeadshot(file: File, dest: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.storage.from('headshots').upload(dest, file, {
    cacheControl: '3600',
    upsert: true,
  })
  return { data, error }
}
