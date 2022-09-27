import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import deletePlan from "../../services/deletePlan";

export default function SelectPlanModal({
  openSelectPlanModal,
  doCloseSelectPlanModal,
  selectedPlan,
  setPlanId,
  setPage,
  doRefresh,
  refresh,
}) {
// ================================================ STYLING ================================================
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

// ================================================ FUNCTIONS ================================================
  const openPlanPage = () => {
    setPlanId(selectedPlan.id);
    setPage("planPage");
    doCloseSelectPlanModal();
  };

  const openWishPage = () => {
    setPlanId(selectedPlan.id);
    setPage("wishPage");
    doCloseSelectPlanModal();
  };

  const deletePlanAndCloseModal = async () => {
    await deletePlan(selectedPlan.id);
    doRefresh(!refresh);
    doCloseSelectPlanModal();
  };

// ================================================ RETURN ================================================
  return (
    <Modal open={openSelectPlanModal} onClose={doCloseSelectPlanModal}>
      <Box sx={style}>
        <h2 className="new-plan-title">{selectedPlan.name}</h2>
        <h3 className="new-plan-title">Was möchtest du tun?</h3>
        <Button variant="contained" onClick={openPlanPage}>
          Plan öffnen
        </Button>
        <br />
        <br />
        <Button variant="contained" onClick={openWishPage}>
          Wunschliste Öffnen
        </Button>
        <br />
        <br />
        <Button
          variant="contained"
          color="warning"
          onClick={deletePlanAndCloseModal}
        >
          Plan löschen
        </Button>
        <br />
      </Box>
    </Modal>
  );
}
