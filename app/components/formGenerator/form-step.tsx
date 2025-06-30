import {useForm} from "react-hook-form";
import {Button, Grid, IconButton, Typography} from "@mui/material";
import Input from "~/components/formGenerator/input";
import {useLocation} from "react-router";
import {Fragment, useEffect} from "react";

export default function FormStep({formStep, onSubmit, onBack, payloads}: {
    formStep: FormStep,
    onSubmit: (payloads: object) => void,
    onBack: () => void,
    payloads: {
        [key: string]: any;
    }
},) {
    const form = useForm({
        values: formStep.fields.filter(item => !['submit', 'send'].includes(item.name)).reduce((acc: any, item: Field) => {
            acc[item.name] = payloads[item.name] ?? (['checkbox', 'captcha'].includes(item.type) ? false : item.value);
            return acc;
        }, {})
    });


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        //get value from url and set to form
        formStep.fields.filter(item => !['submit', 'send'].includes(item.name)).map(field => {
            const queryValue = queryParams.get(field.name)
            if (queryValue) {
                form.setValue(field.name, queryValue);
            }
        })
    }, []);

    return <Grid>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Grid display={'flex'} my={2}>
                {
                    formStep?.back && <Button variant={'outlined'} onClick={() => {
                        onBack();
                    }}>
                        Back
                    </Button>
                }
                {formStep?.title && <Typography variant={'h5'}>{JSON.parse(formStep?.title)?.message}</Typography>}
            </Grid>
            <Grid container display={'flex'} flexDirection={'column'} spacing={2}>
                {formStep.fields.filter(item => !formStep.hideFields?.some(it => item.name === it)).map((field, index) => {
                    return <Fragment key={`field-${field?.name ?? ''}-${index}`}>
                        <Input field={field} form={form}/>
                    </Fragment>
                })}
            </Grid>
        </form>
    </Grid>
}
