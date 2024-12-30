import { useEffect, useState } from "react";

const truncateTime = (date: Date): Date => {
return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

function useDidMount() {
  const [didMount, setDidMount] = useState(false)
  useEffect(() => { setDidMount(true) }, [])

  return didMount
}

function DueStatus(dueAt: string, completed: boolean): string {
const today = truncateTime(new Date());
const dueDate = truncateTime(new Date(dueAt));

  if (completed) {
    return 'Completed';
  }

  if (dueDate < today) {
    return 'Overdue';
  } else if (dueDate > today) {
    return 'Upcoming';
  } else {
    return 'Today';
  }
}

export { DueStatus, useDidMount };