'use client'

import { convertToBase64 } from '@/app/(app-shell)/entrants/utils'
import { InputLabel, Group, rem, Text } from '@mantine/core'
import { Dropzone, DropzoneAccept, DropzoneReject, DropzoneIdle } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react'
import { useState, useRef } from 'react'

export function PhotoDropzoneSSR({ initialValue }: { initialValue?: string }) {
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const [photoRaw, setPhotoRaw] = useState<string | undefined>(undefined)

  return (
    <div className="row-span-4 lg:row-span-5 col-end-[-1] row-start-1">
      <InputLabel onClick={() => dropzoneRef.current?.focus()}>Photo</InputLabel>
      {/* hidden input must have type="file" */}
      <input ref={hiddenInputRef} type="file" name="photo" className="hidden" />
      <Dropzone
        ref={dropzoneRef}
        multiple={false}
        onDrop={async ([file]) => {
          if (!file) {
            notifications.show({
              color: 'red',
              title: 'Error',
              message: 'No file / entrant selected',
            })
            return
          }

          if (hiddenInputRef.current) {
            // Note the specific way we need to munge the file into the hidden input
            // https://stackoverflow.com/a/68182158/1068446
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            hiddenInputRef.current.files = dataTransfer.files
          }
          console.log('file', file, hiddenInputRef.current, hiddenInputRef.current?.files)

          convertToBase64(file).then((result) => {
            setPhotoRaw(result)
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
          {photoRaw || initialValue ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoRaw || initialValue || undefined}
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
