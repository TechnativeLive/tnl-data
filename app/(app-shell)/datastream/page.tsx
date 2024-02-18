import { Button, Flex, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { createServerClient } from '@/lib/db/server';
import { DatastreamKeyCopyButton } from '@/app/(app-shell)/datastream/copy-button';
import groupBy from 'object.groupby';
import { CreateDatastreamModal } from '@/app/(app-shell)/datastream/create-datastream-modal';
import { createDatastream, deleteDatastream } from '@/app/(app-shell)/datastream/actions';
import { SimpleForm } from '@/components/forms/simple-form';
import { ConfirmButton } from '@/components/mantine-extensions/confirm-button';

// export const dynamic = 'force-dynamic';

export default async function DatastreamPage() {
  const supabase = createServerClient();

  const { data: dsKeys, error } = await supabase
    .from('ds_keys')
    .select('name, kind, description, public, private, id')
    .order('name', { ascending: true });

  if (error) {
    return <div>{error.message}</div>;
  }

  const dsKeyKinds = groupBy(dsKeys, (key) => key.kind);

  return (
    <Flex justify="center" className="flex-1 py-4 mb-4 mx-content">
      <Stack w="100%" gap="xl">
        <div className="flex justify-between gap-6">
          <Title>Datastream Keys</Title>
          <CreateDatastreamModal>
            <SimpleForm action={createDatastream} className="flex flex-col gap-4">
              <TextInput name="name" label="Name" />
              <TextInput name="description" label="Description" />
              <Select
                label="Kind"
                name="kind"
                data={[
                  { value: 'data', label: 'Data' },
                  { value: 'timer', label: 'Timer' },
                ]}
              />
              <Button type="submit" variant="filled" mt="lg">
                Create Datastream
              </Button>
            </SimpleForm>
          </CreateDatastreamModal>
        </div>

        {Object.entries(dsKeyKinds).map(([kind, keys]) => (
          <div key={kind} className="flex flex-col gap-md" style={{ order: kind.charCodeAt(0) }}>
            <Title order={2} className="capitalize">
              {kind}
            </Title>
            <div
              className="grid gap-x-6"
              style={{ gridTemplateColumns: `repeat(3,max-content) auto min-content` }}
            >
              <div className="subgrid-cols col-span-full py-2 px-4 border font-semibold bg-body-dimmed rounded-t-md">
                <div>Name</div>
                <div>Public</div>
                <div>Private</div>
                <div>Description</div>
                <div></div>
              </div>
              {keys?.map((key) => (
                <div
                  key={key.public}
                  className="subgrid-cols col-span-full items-center py-2 px-4 border-b border-x last:rounded-b-md"
                >
                  <Text fw={600}>{key.name}</Text>
                  <DatastreamKeyCopyButton value={key.public} />
                  <DatastreamKeyCopyButton value={key.private} />
                  <Text fz="sm" c="dimmed" fs="italic">
                    {key.description}
                  </Text>
                  <SimpleForm action={deleteDatastream} className="flex justify-end">
                    <input name="id" value={key.id} hidden readOnly />
                    <ConfirmButton type="submit">Delete</ConfirmButton>
                  </SimpleForm>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Stack>
    </Flex>
  );
}
