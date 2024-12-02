type BoardColumn = {
  label: string;
  value: string;
};

export const boardColumns: BoardColumn[] = [
  { label: "To Do", value: "not_started" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "completed" },
];
