import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function PlanTableRow({
  setSelectedPlan,
  doOpenSelectPlanModal,
  doRefresh,
  refresh,
  plan,
  index,
}) {
  return (
    <div key={index}>
      <ListItem>
        {/* Iconbutton if the plan is visible in the client-app (changeable by click) */}
        <IconButton
          onClick={async () => {
            await updateDoc(doc(db, "plans", plan.id), {
              public: !plan.public,
            });
            doRefresh(!refresh);
          }}
        >
          {plan.public ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        <ListItemButton
          sx={{ bgcolor: "#f0f0f0" }}
          onClick={() => {
            setSelectedPlan(plan);
            doOpenSelectPlanModal();
          }}
        >
          <ListItemText sx={{ textAlign: "center" }}>{plan.name}</ListItemText>
        </ListItemButton>
        {/* Iconbutton if wishes for that plan can be eddited in the client-app (changeable by click) */}
        <IconButton
          onClick={async () => {
            await updateDoc(doc(db, "plans", plan.id), {
              openForWishes: !plan.openForWishes,
            });
            doRefresh(!refresh);
          }}
        >
          {plan.openForWishes ? <EventAvailableIcon /> : <EventBusyIcon />}
        </IconButton>
      </ListItem>
    </div>
  );
}
