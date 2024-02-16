import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

let hasExtended = false;
function extendDayJs() {
  if (hasExtended) return;
  dayjs.extend(relativeTime);
  hasExtended = true;
}

type DateValue = string | number | Date | dayjs.Dayjs | null | undefined;

export const day = {
  to: (dateString: DateValue, futureDateString: DateValue) => {
    extendDayJs();
    return dayjs(futureDateString).to(dateString);
  },
  from: (date: DateValue, pastDate: DateValue) => {
    extendDayJs();
    return dayjs(pastDate).from(date);
  },
  toNow: (futureDateString: DateValue) => {
    extendDayJs();
    return dayjs(futureDateString).toNow();
  },
  fromNow: (pastDateString: DateValue) => {
    extendDayJs();
    return dayjs(pastDateString).fromNow();
  },
};
