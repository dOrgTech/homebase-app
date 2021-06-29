export interface OperationTimestampDTO {
  id: number;
  timestamp: string;
}

export interface DropOperationDTO {
  id: number;
  timestamp: string;
  parameter: {
    entrypoint: string;
    value: string;
  }
}
