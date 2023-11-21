import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const test = dayjs(new Date());

type DateValue = string | number | Date | dayjs.Dayjs | null | undefined;

export const day = {
  to: (dateString: DateValue, futureDateString: DateValue) => {
    if (!test.to) {
      dayjs.extend(relativeTime);
    }
    return dayjs(futureDateString).to(dateString);
  },
  from: (date: DateValue, pastDate: DateValue) => {
    if (!test.from) {
      dayjs.extend(relativeTime);
    }
    return dayjs(pastDate).from(date);
  },
  toNow: (futureDateString: DateValue) => {
    if (!test.toNow) {
      dayjs.extend(relativeTime);
    }
    return dayjs(futureDateString).toNow();
  },
  fromNow: (pastDateString: DateValue) => {
    if (!test.toNow) {
      dayjs.extend(relativeTime);
    }
    return dayjs(pastDateString).fromNow();
  },
};
