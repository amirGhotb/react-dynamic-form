import {CircularProgress, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import FormGenerator from "~/components/formGenerator";

export default function Register() {
    const [formSteps, setFormSteps] = useState<FormStep[]>([]);
    const [loading, setLoading] = useState(false);

    async function FetchFormItems() {
        const response = await fetch('https://api.winazbet.com/v3/default/config');
        return await response.json()
    }

    useEffect(() => {
        setLoading(true);
        FetchFormItems().then(res => {
            setFormSteps(res?.form?.register ?? [])
            setLoading(false);
        });
    }, []);


    return <Grid container justifyContent={'center'} minHeight={'100vh'} alignItems={'center'}>
        {loading && <CircularProgress/>}
        {formSteps.length > 0 && <Grid item xs={12} lg={6}>
            <FormGenerator formSteps={formSteps}/>
        </Grid>}
    </Grid>;
}
