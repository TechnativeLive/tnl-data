import { singular } from '@/lib/singular/client'
import { getByteSize, safeError } from '@/lib/utils'
import { notifications } from '@mantine/notifications'

type SingularDatastream = {
  id: number
  name: string
  private_token: string
  public_token: string
  payload: string
  created_at: string
  updated_at: string
  account_id: number
}

const API_SIZE_LIMIT = 60_000

export function updateDatastreams(updates: Parameters<typeof updateDatastream>[0][]) {
  return Promise.all(updates.map(updateDatastream))
}

const notified: Record<string, boolean> = {}

// Keep a reference to the previously sent body, per datastream. This includes the custom message.
// Clear every ~10s to ensure we don't get left on stale data.
const previousBodyMap = new Map<string, string>()
setInterval(() => {
  previousBodyMap.clear()
}, 1000 * 10)

export function updateDatastream({
  privateKey,
  body,
  customMessage,
}: {
  privateKey?: string
  body: Record<string, unknown>
  customMessage?: unknown
}) {
  if (!privateKey) return Promise.resolve()
  const fullBody = customMessage ? { ...body, message: customMessage } : body
  const bodyText = JSON.stringify(fullBody)
  if (previousBodyMap.get(privateKey) === bodyText) {
    return Promise.resolve()
  }

  const size = getByteSize(fullBody)
  console.log({ size, privateKey })

  if (size > API_SIZE_LIMIT && !notified[privateKey]) {
    notified[privateKey] = true
    notifications.show({
      title: 'Datastream size exceeds API limit',
      message: 'Please notify the TNL team of this error',
    })
    console.warn(
      `Datastream size exceeds API limit (${size} bytes - ${((100 * size) / API_SIZE_LIMIT).toFixed(2)}%)`,
      {
        privateKey,
        body,
        customMessage,
      },
    )
  } else {
    previousBodyMap.set(privateKey, bodyText)

    return fetch(`https://datastream.singular.live/datastreams/${privateKey}`, {
      body: bodyText,
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    })
  }
}

type DeleteResponse = {
  code: 200
  message: 'success'
}

export const datastreamKeys = {
  create: async (name: string) => {
    if (!name) {
      return safeError({ code: -1, message: 'Name is required when creating a datastream' })
    }

    return await singular<SingularDatastream>(`/apiv1/datastreams`, {
      method: 'POST',
      body: JSON.stringify({ name: `TNL - ${name}` }),
    })
  },

  update: async (id: number, name: string) => {
    if (!name || !id) {
      return safeError({
        code: -1,
        message: 'Name & ID is required when updating a datastream',
      })
    }

    return await singular<DeleteResponse>(`/apiv1/datastreams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: `TNL - ${name}` }),
    })
  },

  delete: async (id: number) => {
    if (!id) {
      return safeError({ code: -1, message: 'ID is required when deleting a datastream' })
    }

    return await singular<DeleteResponse>(`/apiv1/datastreams/${id}`, { method: 'DELETE' })
  },
}
