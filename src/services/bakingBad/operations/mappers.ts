import { OperationDTO, OperationsDTO, Vote } from "./types";

export const dtoToVotes = (
  operationsDTO: OperationsDTO,
  proposalKey: string
): Vote[] => {
  const operations = operationsDTO.operations as any;

  const proposalVoteDTOs: OperationDTO<"vote">[] = operations.filter(
    (operation: OperationDTO<"vote">) => {
      if (operation.entrypoint !== "vote") {
        return false;
      }

      return (
        operation.parameters.children[0].children[0].value.toLowerCase() ===
        proposalKey.toLowerCase()
      );
    }
  );

  return proposalVoteDTOs.map((voteDto) => ({
    timestamp: voteDto.timestamp,
    voter: voteDto.source,
    favor: voteDto.parameters.children[0].children[1].value,
    value: Number(voteDto.parameters.children[0].children[2].value),
    proposalKey: proposalKey.toLowerCase(),
  }));
};
