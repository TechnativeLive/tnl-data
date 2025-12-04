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
export async function EntrantList() {
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
        const slug = entrants[0]?.sports?.slug
        const Icon = slug && slug in PROJECT_ICONS ? PROJECT_ICONS[slug]! : IconQuestionMark

        return (
          <AccordionItem value={sport} key={sport}>
            <AccordionControl icon={<Icon />}>{sport}</AccordionControl>
            <AccordionPanel>
              <Accordion variant="contained">
                {entrants.map((entrant) => (
                  <AccordionItem key={entrant.id} value={entrant.id.toString()}>
                    <AccordionControl>
                      <SimpleGrid cols={5}>
                        <Text span>{entrant.id}</Text>
                        <Text span>{entrant.first_name}</Text>
                        <Text span>{entrant.last_name}</Text>
                        <Text span>{entrant.country}</Text>
                        <Text span>{entrant.dob}</Text>
                      </SimpleGrid>
                    </AccordionControl>
                    <AccordionPanel>
                      <JsonInput value={JSON.stringify(entrant.data)} />
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
