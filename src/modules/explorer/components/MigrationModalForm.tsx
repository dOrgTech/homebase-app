import {Step, StepConnector, StepLabel, Stepper, Theme, withStyles} from "@material-ui/core";
import {styled} from "@material-ui/styles";
import React, {useEffect, useState} from "react";
import {MigrationCreateStep} from "./MigrationCreateStep";
import {MigrationInitialStep} from "./MigrationInitialStep";

import {ResponsiveDialog} from "./ResponsiveDialog";
import {MigrationTransferStep} from "./MigrationTransferStep";
import {MigrationExecutionStep} from "./MigrationExecutionStep";

type MigrationModalFormProps = {
    showModal: boolean;
    onClose: () => void;
};

const StyledStepper = styled(Stepper)(({theme}: { theme: Theme }) => ({
    width: "100%",
    paddingLeft: 0,
    paddingRight: 0,
    background: "inherit",
    "& .MuiStepConnector-alternativeLabel": {
        left: "calc(-50% + 19px)",
        right: "calc(50% + 19px)",
        top: 16,
        marginLeft: 0,
        "& .MuiStepConnector-lineHorizontal": {
            borderColor: theme.palette.primary.light,
            borderTopWidth: 3,
        },
    },

    "& .MuiStepIcon-root": {
        border: `3px solid ${theme.palette.primary.light}`,
    },
}));

const ColorlibConnector = withStyles((theme: Theme) => ({
    alternativeLabel: {
        top: 22,
    },
    active: {
        "& $line": {
            backgroundColor: theme.palette.secondary.main,
        },
    },
    completed: {
        "& $line": {
            backgroundColor: theme.palette.secondary.main,
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.primary.light,
        borderRadius: 1,
    },
}))(StepConnector);

const StyledLabel = styled(StepLabel)(({theme, focused}: { theme: Theme; focused: boolean }) => ({
    "& .MuiStepIcon-root": {
        borderWidth: 3,
    },
    "& .MuiStepLabel-alternativeLabel": {
        marginLeft: 0,
        color: focused ? theme.palette.secondary.main : theme.palette.primary.light,
    },
    "& .MuiStepIcon-active": {
        borderColor: theme.palette.secondary.main,
        background: theme.palette.secondary.main,
        fill: "none",
    },
    "& .MuiStepIcon-text": {
        fill: "none",
        display: "none",
    },
    "& .MuiStepIcon-completed": {
        borderColor: theme.palette.secondary.main,
        background: theme.palette.secondary.main,
        fill: theme.palette.secondary.main,
    },
    "&. .MuiStepLabel-active": {
        color: theme.palette.secondary.main,
    },
}));

const MIGRATION_STEPPER = ["Create V2 DAO", "Transfer", "Vote and execute"];

export const MigrationModalForm: React.FC<MigrationModalFormProps> = ({showModal, onClose}) => {
    const [currentPopup, setCurrentPopup] = useState<number>(1);
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [newDaoAddress, setNewDaoAddress] = useState<string>("");

    useEffect(() => {
        if (currentPopup) {
            switch (currentPopup) {
                case 1:
                    setCurrentTitle("Homebase V2 is now available!");
                    return;
                case 2:
                case 3:
                    setCurrentTitle("Homebase V2 Migration");
                    return;
                default:
                    setCurrentTitle("Homebase V2 is now available!");
                    return;
            }
        }
    }, [currentPopup]);

    const handleClose = () => {
        onClose();
        setCurrentPopup(1);
        setCurrentStep(0);
    };

    return (
        <ResponsiveDialog
            open={showModal}
            onClose={handleClose}
            alignTitle='center'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            title={currentTitle}>
            {currentPopup !== 1 && (
                <StyledStepper activeStep={currentStep} alternativeLabel connector={<ColorlibConnector/>}>
                    {MIGRATION_STEPPER.map((label, index) => (
                        <Step key={label}>
                            <StyledLabel focused={index === currentStep}>{label}</StyledLabel>
                        </Step>
                    ))}
                </StyledStepper>
            )}
            {currentPopup === 1 && <MigrationInitialStep onClick={() => setCurrentPopup(2)}/>}
            {currentPopup === 2 && (
                <MigrationCreateStep
                    onClick={(address) => {
                        setNewDaoAddress(address)
                        setCurrentPopup(3);
                        setCurrentStep(1);
                    }}
                />
            )}
            {currentPopup === 3 && (
                <MigrationTransferStep newDaoAddress={newDaoAddress} onComplete={() => {
                    setCurrentPopup(4);
                    setCurrentStep(2);
                }}/>
            )}
            {currentPopup === 4 && (
                <MigrationExecutionStep onClick={handleClose}/>
            )}
        </ResponsiveDialog>
    );
};
