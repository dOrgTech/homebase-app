import dayjs from "dayjs";

type EstimatedTimeType = {
    date: string,
    dateHour: string
}

export const getEstimatedTime = (secondsToAdd?: number): EstimatedTimeType => {
    const currentEstimated = {
        date: '',
        dateHour: ''
    }
    console.log(secondsToAdd);
    if (!secondsToAdd) {
        currentEstimated.date = dayjs().format('MM/DD');
        currentEstimated.dateHour = dayjs().format('HH:mm');
    }
    if (secondsToAdd) {
        currentEstimated.date = dayjs().add((secondsToAdd / 60), 'minutes').format('MM/DD');
        currentEstimated.dateHour = dayjs().add((secondsToAdd / 60), 'minutes').format('HH:mm');
    }
    return currentEstimated
}