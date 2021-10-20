import React, { useState } from "react";
import {
  Grid,
  styled,
  Typography,
  Paper,
  DialogContent,
  DialogContentText,
  TextField,
  Switch,
} from "@material-ui/core";
import {
  CustomTextarea,
  DescriptionContainer,
} from "modules/explorer/components/ProposalTextContainer";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { Registry } from "services/contracts/baseDAO";
import * as Yup from "yup";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const BatchBar = styled(Grid)(({ theme }) => ({
  height: 60,
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
  cursor: "pointer",
  overflowX: "auto",
}));

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const TransferActive = styled(Grid)({
  height: 53,
  minWidth: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  minHeight: 31,
  minWidth: 31,
  textAlign: "center",
  padding: 0,
  background: "#383939",
  color: "#fff",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
});

const styles = {
  visible: {
    display: "none",
  },
  active: {
    background: "#3866F9",
  },
  show: {
    visibility: "visible",
  },
  hide: {
    visibility: "hidden",
  },
};

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

const emptyItem = { key: "", value: "" };

export const registryProposalFormInitialState: RegistryProposalFormValues = {
  registryUpdateForm: {
    list: [emptyItem],
    isBatch: false,
  },
};

export interface RegistryProposalFormValues {
  registryUpdateForm: {
    list: Registry[];
    isBatch: boolean;
  };
}

export const updateRegistryFormSchema = Yup.object().shape({
  registryUpdateForm: Yup.object().shape({
    list: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required("Required"),
      })
    ),
  }),
});

export const UpdateRegistryDialog: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState(1);
  const {
    control,
    getValues,
    setValue,
    formState: { errors, touchedFields: touched },
  } = useFormContext<RegistryProposalFormValues>();
  const { fields, append } = useFieldArray({
    control,
    name: "registryUpdateForm.list",
  });
  const values = getValues();
  const [isBatch, setIsBatch] = useState(values.registryUpdateForm.isBatch);

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch);
    setValue("registryUpdateForm.isBatch", !isBatch);
    setActiveItem(1);
  };

  const keyError = (errors?.registryUpdateForm?.list?.[activeItem - 1] as any)
    ?.key;
  const valueError = (errors?.registryUpdateForm?.list?.[activeItem - 1] as any)
    ?.value;

  return (
    <DialogContent>
      <DialogContentText>
        <ProposalFormListItem container direction="row">
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textPrimary">
              Batch Update?
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <SwitchContainer item xs={12} justify="flex-end">
              <Switch
                type="checkbox"
                onChange={handleIsBatchChange}
                checked={isBatch}
              />
            </SwitchContainer>
          </Grid>
        </ProposalFormListItem>

        {fields.map(
          (field, index) =>
            index === activeItem - 1 && (
              <>
                {isBatch ? (
                  <BatchBar container direction="row" wrap="nowrap">
                    {values.registryUpdateForm.list.map((_, index) => {
                      return (
                        <TransferActive
                          item
                          key={index}
                          onClick={() => setActiveItem(index + 1)}
                          style={
                            Number(index + 1) === activeItem
                              ? styles.active
                              : undefined
                          }
                        >
                          <Typography variant="subtitle2" color="textPrimary">
                            #{index + 1}
                          </Typography>
                        </TransferActive>
                      );
                    })}

                    <AddButton
                      onClick={() => {
                        append(emptyItem);
                        setActiveItem(activeItem + 1);
                      }}
                    >
                      +
                    </AddButton>
                  </BatchBar>
                ) : null}

                <ProposalFormListItem container direction="row">
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textPrimary">
                      Key
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <SwitchContainer item xs={12} justify="flex-end">
                      <Controller
                        key={field.id}
                        name={`registryUpdateForm.list.${activeItem - 1}.key`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            type="string"
                            placeholder="Type a Key"
                          />
                        )}
                      />

                      {keyError &&
                      touched.registryUpdateForm?.list?.[activeItem - 1]
                        ?.key ? (
                        <ErrorText>{keyError}</ErrorText>
                      ) : null}
                    </SwitchContainer>
                  </Grid>
                </ProposalFormListItem>

                <DescriptionContainer container direction="row">
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="space-between"
                    >
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textPrimary">
                          Value
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      key={field.id}
                      name={`registryUpdateForm.list.${activeItem - 1}.value`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextarea
                          {...field}
                          multiline
                          type="string"
                          rows={6}
                          placeholder="Type a value"
                        />
                      )}
                    />

                    {valueError &&
                    touched.registryUpdateForm?.list?.[activeItem - 1]
                      ?.value ? (
                      <ErrorText>{valueError}</ErrorText>
                    ) : null}
                  </Grid>
                </DescriptionContainer>
              </>
            )
        )}
      </DialogContentText>
    </DialogContent>
  );
};
