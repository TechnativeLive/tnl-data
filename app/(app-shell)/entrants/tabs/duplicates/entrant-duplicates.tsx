import { PROJECT_ICONS } from '@/components/project-icons'
import { createServerClient } from '@/lib/db/server'
import {
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  SimpleGrid,
  JsonInput,
  Text,
} from '@mantine/core'
import { IconQuestionMark } from '@tabler/icons-react'
import groupBy from 'object.groupby'

const outerAccordionStyles = { content: { padding: 0 } }
export async function EntrantDuplicates() {
  const supabase = createServerClient()
  const { data: entrants } = await supabase
    .from('entrants')
    .select('id, first_name, last_name, nick_name, country, dob, data, sports(name, slug)')
  const sportGroups = entrants
    ? groupBy(entrants, (entrant) => entrant.sports?.name ?? 'none')
    : null

  return (
    <Accordion styles={outerAccordionStyles}>
      {Object.entries(sportGroups ?? {})?.map(([sport, entrants]) => {
        const entrantDuplicatesMap = entrants.reduce(
          (acc, ent) => {
            const id = `${ent.first_name.toLowerCase()}_${ent.last_name.toLowerCase()}`
            if (id in acc) {
              acc[id]!.push(ent)
            } else {
              acc[id] = [ent]
            }
            return acc
          },
          {} as Record<string, (typeof entrants)[number][]>,
        )
        const duplicates = Object.values(entrantDuplicatesMap).filter((ents) => ents.length > 1 && (ents[0]?.first_name || ents[0]?.last_name))
        console.log({ entrantDuplicatesMap, duplicates })

        const slug = entrants[0]?.sports?.slug
        const Icon = slug && slug in PROJECT_ICONS ? PROJECT_ICONS[slug]! : IconQuestionMark

        return (
          <AccordionItem value={sport} key={sport}>
            <AccordionControl icon={<Icon />}>{sport}</AccordionControl>
            <AccordionPanel>
              <Accordion variant="contained">
                {duplicates.map((entrants) => {
                  const entrant = entrants[0]!
                  return (
                    <AccordionItem key={entrant.id} value={entrant.id.toString()}>
                      <AccordionControl>
                        <SimpleGrid cols={6}>
                          <Text span>{entrant.id}</Text>
                          <Text span>{entrant.first_name}</Text>
                          <Text span>{entrant.last_name}</Text>
                          <Text span>{entrant.country}</Text>
                          <Text span>{entrant.dob}</Text>
                          <JsonInput value={JSON.stringify(entrant.data)} className='pr-4' />
                        </SimpleGrid>
                      </AccordionControl>
                      <AccordionPanel className='pr-4'>
                        {entrants.map((e, i) =>
                          i === 0 ? null : (
                            <SimpleGrid key={i} cols={6}>
                              <Text span>{e.id}</Text>
                              <Text span>{e.first_name}</Text>
                              <Text span>{e.last_name}</Text>
                              <Text span>{e.country}</Text>
                              <Text span>{e.dob}</Text>
                              <JsonInput value={JSON.stringify(e.data)} className='pr-4 mb-2' />
                            </SimpleGrid>
                          ),
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
