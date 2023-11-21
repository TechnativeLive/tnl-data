export const tsReadable = new Intl.DateTimeFormat('en-GB', {
  timeStyle: 'medium',
  dateStyle: 'medium',
});
export const tsTerse = new Intl.DateTimeFormat('en-GB', {
  timeStyle: 'medium',
  dateStyle: 'short',
});
export const dsShort = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' });
export const dsLong = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });

type ClassLabels = [Unknown: string, Current: string, Upcoming: string, Past: string];
const defaultLabels: ClassLabels = ['Unknown', 'Current', 'Upcoming', 'Past'];

export function classifyEventsByDate<
  E extends { starts_at?: string | null; ends_at?: string | null }
>(events: E[], labels = defaultLabels) {
  return events.reduce(
    (acc, event) => {
      const classification = classifyEventByDate(event);
      switch (classification) {
        case 'unknown':
          acc[0].data.push(event);
          break;
        case 'current':
          acc[1].data.push(event);
          break;
        case 'future':
          acc[2].data.push(event);
          break;
        case 'past':
          acc[3].data.push(event);
          break;
      }

      return acc;
    },
    [
      { label: labels[0], data: [] as E[] },
      { label: labels[1], data: [] as E[] },
      { label: labels[2], data: [] as E[] },
      { label: labels[3], data: [] as E[] },
    ]
  );
}

export type EventDateClassification = 'unknown' | 'current' | 'future' | 'past';
export function classifyEventByDate<
  E extends { starts_at?: string | null; ends_at?: string | null }
>(event: E): EventDateClassification {
  if (!event.starts_at) {
    return 'unknown';
  }

  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;
  const now = new Date();

  if (start > now) {
    return 'future';
  } else if (end && end < now) {
    return 'past';
  } else {
    return 'current';
  }
}
