import differenceInWeeks from 'date-fns/differenceInWeeks';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';

function time(timeInString) {
  const time = new Date(timeInString);
  const now = new Date();
  const weeks = differenceInWeeks(now, time);
  const days = differenceInDays(now, time);
  const hours = differenceInHours(now, time);
  if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else {
    return `${hours}h`;
  }
}

export default time;
