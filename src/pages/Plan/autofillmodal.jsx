import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  Slider,
  Switch,
  ToggleButton,
} from "@mui/material";
import React from "react";
import autofillPlan from "./autofilllogic";

export default function AutofillModal(props) {
  const doRefresh = props.doRefresh
  const open = props.open;
  const planId = props.planId
  const closeAutofillModal = props.closeAutofillModal;
  const [noShortSwitches, setNoShortSwitches] = React.useState(true);
  const [no2WeInRow, setNo2WeInRow] = React.useState(false);
  const [no2SaInRow, setNo2SaInRow] = React.useState(true);
  const [no2SaInMonth, setNo2SaInMonth] = React.useState(false);
  const [respectClinic, setRespectClinic] = React.useState(true);
  const [iterations, setIterations] = React.useState(5000)

  const [openProgress, setOpenProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 630,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const styleProgress = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 630,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  React.useEffect(() => {
    if (progress >= 100) setOpenProgress(false);
  }, [progress]);

  return (
    <div>
      <Modal open={open} onClose={closeAutofillModal}>
        <Box sx={style}>
          <h2 className="new-plan-title">Plan automatisch füllen</h2>

          <div className="autofill-switch-container">
            <FormControlLabel
              control={
                <Switch
                  checked={noShortSwitches}
                  onChange={(e) => setNoShortSwitches(e.target.checked)}
                />
              }
              label="Keine kurzen Wechsel"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={no2WeInRow}
                  onChange={(e) => setNo2WeInRow(e.target.checked)}
                />
              }
              label="Keine 2 Wochenenden in Folge"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={no2SaInRow}
                  onChange={(e) => setNo2SaInRow(e.target.checked)}
                />
              }
              label="Keine 2 Samstage in Folge"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={no2SaInMonth}
                  onChange={(e) => setNo2SaInMonth(e.target.checked)}
                />
              }
              label="Keine 2 Samstage im Monat"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={respectClinic}
                  onChange={(e) => setRespectClinic(e.target.checked)}
                />
              }
              label="Kliniken berücksichtigen"
            />
            <br />
            <br />
          </div>
          <h3>Optimierungsgrad</h3>
          <Slider min={1000} max={100000} value={iterations} onChange={(e) => setIterations(e.target.value)} />
          <p>Wirkt sich auf die Berechnungsdauer aus</p>
          <br />
          <br />
          <br />
          <Button
            variant="outlined"
            color="success"
            sx={{ marginLeft: "20px" }}
            onClick={() => {
              props.saveOldDays();
              autofillPlan({
                planId: planId,
                noShortSwitches: noShortSwitches,
                no2SaInMonth: no2SaInMonth,
                no2SaInRow: no2SaInRow,
                no2WeInRow: no2WeInRow,
                setProgress: setProgress,
                iterations: iterations,
                respectClinic: respectClinic,
                doRefresh: doRefresh
              });
              closeAutofillModal();
              setOpenProgress(true);
            }}
          >
            Plan füllen!
          </Button>
        </Box>
      </Modal>
      <Modal open={openProgress}>
        <Box sx={styleProgress}>
          <h2>Fortschritt der Dienstplanerstellung</h2>
          <h3>{progress} %</h3>
        </Box>
      </Modal>
    </div>
  );
}
