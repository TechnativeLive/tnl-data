import { singular } from '@/lib/singular/client';
import { safeError } from '@/lib/utils';

type SingularDatastream = {
  id: number;
  name: string;
  private_token: string;
  public_token: string;
  payload: string;
  created_at: string;
  updated_at: string;
  account_id: number;
};

export function updateDatastream(
  privateKey: string,
  body: Record<string, unknown>,
  customMessage?: unknown,
) {
  console.log('updateDatastream');
  return fetch(`https://datastream.singular.live/datastreams/${privateKey}`, {
    body: JSON.stringify(customMessage ? { ...body, message: customMessage } : body),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });
}

type DeleteResponse = {
  code: 200;
  message: 'success';
};

export const datastream = {
  create: async (name: string) => {
    if (!name) {
      return safeError({ code: -1, message: 'Name is required when creating a datastream' });
    }

    return await singular<SingularDatastream>(`/apiv1/datastreams`, {
      method: 'POST',
      body: JSON.stringify({ name: `TNL - ${name}` }),
    });
  },

  update: async (id: number, name: string) => {
    if (!name || !id) {
      return safeError({
        code: -1,
        message: 'Name & ID is required when updating a datastream',
      });
    }

    return await singular<DeleteResponse>(`/apiv1/datastreams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: `TNL - ${name}` }),
    });
  },

  delete: async (id: number) => {
    if (!id) {
      return safeError({ code: -1, message: 'ID is required when deleting a datastream' });
    }

    return await singular<DeleteResponse>(`/apiv1/datastreams/${id}`, { method: 'DELETE' });
  },
};
