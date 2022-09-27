import { Button, TextField } from "@mui/material";
import md5 from "md5";
import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage({setPage}) {
    const [text, setText] = React.useState("")
    const auth = getAuth()

    return (
        <div className="body">
            <h1>Willkommen zur Dienstplanerstellung!</h1>
            <h2>Bitte gib das Passwort ein</h2>
            <TextField type="password" id="login" variant="standard" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                if(e.key === "Enter"){login(auth, text, setPage)}
            }} />
            <br/><br/>
            <Button variant="outlined" color="success" onClick={login}>Einloggen</Button>
        </div>
    )
}

const login = (auth, text, setPage) => {
    signInWithEmailAndPassword(auth, "login@dienstplan.app", md5(text))
    .then((userCredentials) => {
        setPage("landingPage")
    })
    .catch((error) => {
        return
    })
}