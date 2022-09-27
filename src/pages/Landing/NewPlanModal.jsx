import React from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Input,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import createNewPlan from "./createnewplan";

/* 
modal to create a new plan in the database
year, month and name of the plan can be choosen
opens/ closes with "doOpenPlanModal()" and "doClosePlanModal()" 
*/
export default function NewPlanModal({
  refresh,
  doRefresh,
  openPlanModal,
  doClosePlanModal,
}) {
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
  };

  const months = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];

// ================================================ STATES ================================================

  const [selectedMonth, setSelectedMonth] = React.useState(0);
  const [selectedYear, setSelectedYear] = React.useState(2022);
  const [planName, setPlanName] = React.useState("");

  // ================================================ FUNCTIONS ================================================
  
  const changeMonth = (e, alignment) => {
    setSelectedMonth(alignment);
  };

  const createPlan = async () => {
    if (planName !== "") {
      await createNewPlan(selectedMonth, selectedYear, planName);
      doClosePlanModal();
      doRefresh(!refresh);
    }
  };

// ================================================ RETURN ================================================
  return (
    <Modal open={openPlanModal} onClose={doClosePlanModal}>
      <Box sx={style}>
        <h2 className="new-plan-title">Neuen Plan erstellen</h2>
        <IconButton
          onClick={() => {
            setSelectedYear(selectedYear - 1);
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
        <span className="year-label">{selectedYear}</span>
        <IconButton
          onClick={() => {
            setSelectedYear(selectedYear + 1);
          }}
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>
        <br />
        <br />
        <ToggleButtonGroup
          color="warning"
          value={selectedMonth}
          exclusive
          onChange={changeMonth}
        >
          {months.map((month, index) => {
            return (
              <ToggleButton key={index} value={index}>
                {month}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <br />
        <br />
        <br />
        <Input
          value={planName}
          placeholder="Name für neuen Plan"
          onChange={(e) => {
            setPlanName(e.target.value);
          }}
        />
        <Button
          variant="outlined"
          color="success"
          sx={{ marginLeft: "20px" }}
          onClick={createPlan}
        >
          Plan erstellen!
        </Button>
      </Box>
    </Modal>
  );
}
