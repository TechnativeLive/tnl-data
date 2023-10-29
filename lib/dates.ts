type ClassLabels = [Unknown: string, Current: string, Upcoming: string, Past: string];
const defaultLabels: ClassLabels = ['Unknown', 'Current', 'Upcoming', 'Past'];

export function classifyEventsByDate<
  E extends { starts_at?: string | null; ends_at?: string | null }
>(events: E[], labels = defaultLabels) {
  return events.reduce(
    (acc, event) => {
      if (!event.starts_at) {
        acc[0].data.push(event);
        return acc;
      }

      const start = new Date(event.starts_at);
      const end = event.ends_at ? new Date(event.ends_at) : null;
      const now = new Date();

      if (start > now) {
        // upcoming
        acc[2].data.push(event);
      } else if (end && end < now) {
        // past
        acc[3].data.push(event);
      } else {
        // current
        acc[1].data.push(event);
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
