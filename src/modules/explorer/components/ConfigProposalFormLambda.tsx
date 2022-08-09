/* eslint-disable react/display-name */
import {
  Grid,
  Typography,
  TextField,
  styled,
  makeStyles,
} from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { SendButton } from "./ProposalFormSendButton";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDAOID } from "../pages/DAO/router";
import { ProposalFormInput, ProposalFormTextarea } from "./ProposalFormInput";
import { useProposeConfigChange } from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange";
import { ResponsiveDialog } from "./ResponsiveDialog";
import Prism, { highlight, plugins } from "prismjs";
import Editor from "react-simple-code-editor";
import "prism-themes/themes/prism-night-owl.css";
import { MainButton } from "modules/common/MainButton";
import { SearchLambda } from "./styled/SearchLambda";

const StyledSendButton = styled(MainButton)(({ theme }) => ({
  width: 101,
  color: "#1C1F23",
}));

type LambdaValues = {
  label: string;
  code: string;
  type: string;
};

const StyledRow = styled(Grid)({
  marginTop: 30,
});

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  lambda_name: string;
  lambda_contract?: string;
  lambda_token_address?: string;
};

enum ProposalModalKey {
  new,
  remove,
  execute,
}

export type ProposalFormDefaultValues = RecursivePartial<Values>;

interface Props {
  open: boolean;
  action: any;
  handleClose: () => void;
  defaultValues?: ProposalFormDefaultValues;
  defaultTab?: number;
}

const ProgressContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  position: "sticky",
  top: 0,
}));

const MarginContainer = styled(Grid)({
  marginTop: 32,
});

const CustomEditor = styled(Editor)({
  "& textarea": {
    outline: "none !important",
  },
  "& textarea:focus-visited": {
    outline: "none !important",
  },
});

const styles = makeStyles({
  textarea: {
    minHeight: 500,
    maxHeight: 500,
    overflow: "scroll",
  },
});

export const ProposalFormLambda: React.FC<Props> = ({
  open,
  handleClose,
  action,
}) => {
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const { data: daoHoldings } = useDAOHoldings(daoId);

  const methods = useForm<Values>();

  const lambdaName = methods.watch("lambda_name");

  const style = styles();

  const grammar = Prism.languages.javascript;

  const onSubmit = useCallback(
    (values: Values) => {
      setCode("");
      handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (open) {
      setCode("");
      methods.setValue("lambda_name", "");
    }
  }, [open, methods]);

  const lambdaOptions = [
    {
      label: "_paymentTokenIndex",
      code: `const allowances = new MichelsonMap();
      const ledger = new MichelsonMap();
      ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });`,
      type: "read",
    },
    {
      label: "addPaymentToken",
      code: `const tokens = new MichelsonMap();
      const ledger = new MichelsonMap();
      ledger.set('', { tokens, balance: '100' });`,
      type: "write",
    },
    {
      label: "clientProjects",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "defaultPollValues",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "setConversionRates",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "addPaymentToken",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "clientProjects",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "defaultPollValues",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
    {
      label: "setConversionRates",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "read",
    },
    {
      label: "clientProjects",
      code: `const clients = new MichelsonMap();
      ledger.set('', { clients, balance: '100' });`,
      type: "write",
    },
  ];

  const [code, setCode] = React.useState<string>(
    action === 0
      ? `const allowances = new MichelsonMap();
  const ledger = new MichelsonMap();
  ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  });   
}`
      : ""
  );

  const handleChange = (data: LambdaValues) => {
    if (data?.code) {
      methods.setValue("lambda_name", data.label);
      return setCode(data.code);
    }
    return setCode("");
  };

  return (
    <FormProvider {...methods}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={ProposalModalKey[action] + " Lambda Proposal"}
        template={"lambda"}
      >
        <Grid container direction={"row"} spacing={4}>
          <ProgressContainer item xs={6} container direction="column">
            <Grid item>
              <ProposalFormInput label={"Lambda Name"}>
                <Controller
                  control={methods.control}
                  name={`lambda_name`}
                  render={({ field }) =>
                    action === 0 ? (
                      <TextField
                        {...field}
                        placeholder="Enter Lambda Name"
                        InputProps={{ disableUnderline: true }}
                      />
                    ) : (
                      <Grid>
                        <SearchLambda
                          lambdas={lambdaOptions}
                          handleChange={handleChange}
                        />
                      </Grid>
                    )
                  }
                />
              </ProposalFormInput>
            </Grid>

            {action === 2 && methods.getValues("lambda_name") ? (
              <>
                <MarginContainer item>
                  <ProposalFormInput label={"Contract"}>
                    <Controller
                      control={methods.control}
                      name={`lambda_contract`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Enter Address"
                          InputProps={{ disableUnderline: true }}
                        />
                      )}
                    />
                  </ProposalFormInput>
                </MarginContainer>

                <MarginContainer item>
                  <ProposalFormInput label={"Token Address"}>
                    <Controller
                      control={methods.control}
                      name={`lambda_token_address`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Enter Address"
                          InputProps={{ disableUnderline: true }}
                        />
                      )}
                    />
                  </ProposalFormInput>
                </MarginContainer>
              </>
            ) : null}
          </ProgressContainer>
          <Grid item xs={6} container direction="column">
            <ProposalFormTextarea label={"Implementation"}>
              <CustomEditor
                disabled={action !== 0}
                textareaClassName={style.textarea}
                preClassName={style.textarea}
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, grammar, "javascript")}
                padding={10}
                style={{
                  fontFamily: "Roboto Mono",
                  fontSize: 14,
                  fontWeight: 400,
                  outlineWidth: 0,
                }}
              />
            </ProposalFormTextarea>
          </Grid>
        </Grid>

        <StyledRow
          container
          direction={"row"}
          spacing={4}
          justifyContent="flex-end"
        >
          <StyledSendButton
            onClick={methods.handleSubmit(onSubmit as any)}
            disabled={!code || !lambdaName}
          >
            Submit
          </StyledSendButton>
        </StyledRow>
      </ResponsiveDialog>
    </FormProvider>
  );
};
