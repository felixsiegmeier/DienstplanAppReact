import React from "react";
import { db } from "../../firebase";
import { Box, Button, List } from "@mui/material";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import NewPlanModal from "./NewPlanModal";
import SelectPlanModal from "./SelectPlanModal";
import PlanTableRow from "./PlanTableRow";

export default function LandingPage({ setPlanId, setPage }) {

  // ================================================ STATES ================================================

  // state to save the plan-data from database
  const [plans, setPlans] = React.useState([]);

  // state what gets changed whenever a plan gets created or deleted to update the table via useEffect (below)
  const [refresh, doRefresh] = React.useState(false);

  // state of modal for creating a new plan
  const [openPlanModal, setOpenPlanModal] = React.useState(false);

  // state of modal to choose from after clicking on a plan in the Table of all plans
  const [openSelectPlanModal, setOpenSelectPlanModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState({});

  // ================================================ DATABASE ================================================

  // this useEffect is required to display correct after adding or deleting a plan (which invokes "doRefresh")
  React.useEffect(() => {
    const getData = async () => {
      const plansRef = collection(db, "plans");
      const q = query(plansRef, orderBy("createdAt"));
      const data = await getDocs(q);
      setPlans(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  }, [refresh]);

// ================================================ FUNCTIONS ================================================
  const doOpenPlanModal = () => {
    setOpenPlanModal(true);
  };

  const doClosePlanModal = () => {
    setOpenPlanModal(false);
  };

  const doOpenSelectPlanModal = () => {
    setOpenSelectPlanModal(true);
  };

  const doCloseSelectPlanModal = () => {
    setOpenSelectPlanModal(false);
  };

// ================================================ RETURN ================================================
  return (
    <div className="body">
      <h1>Willkommen bei der Dienstplanerstellung!</h1>
      {/* Open the doctors page */}
      <Button
        variant="contained"
        color="success"
        sx={{ marginTop: "50px" }}
        onClick={() => {
          setPage("doctorsPage");
        }}
      >
        Ärzte Verwalten
      </Button>
      <h2>Plan auswählen</h2>
      {/* List of all Plans which can be clicked to open the "SelectPlanModal" */}
      <Box sx={{ width: "100%", maxWidth: 500, display: "inline-block" }}>
        <List>
          {plans.map((plan, index) => {
            return (
              <PlanTableRow
                refresh={refresh}
                doRefresh={doRefresh}
                setSelectedPlan={setSelectedPlan}
                doOpenSelectPlanModal={doOpenSelectPlanModal}
                plan={plan}
                index={index}
              />
            );
          })}
        </List>
      </Box>
      <SelectPlanModal
        openSelectPlanModal={openSelectPlanModal}
        doCloseSelectPlanModal={doCloseSelectPlanModal}
        selectedPlan={selectedPlan}
        setPlanId={setPlanId}
        setPage={setPage}
        doRefresh={doRefresh}
        refresh={refresh}
      />
      <br />
      {/* Button to create a new plan/ open the "NewPlanModal" */}
      <Button
        variant="contained"
        color="warning"
        sx={{ marginTop: "50px" }}
        onClick={doOpenPlanModal}
      >
        Neuen Plan erstellen
      </Button>
      <NewPlanModal
        refresh={refresh}
        doRefresh={doRefresh}
        openPlanModal={openPlanModal}
        doClosePlanModal={doClosePlanModal}
      />
    </div>
  );
}
