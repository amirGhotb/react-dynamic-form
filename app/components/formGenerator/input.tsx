import {Autocomplete, Button, Checkbox, FormControlLabel, Grid, TextField} from "@mui/material";
import {
    Controller,
    type ControllerRenderProps, type UseFormReturn
} from "react-hook-form";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";

export default function Input({field, form}: {
                                  field: Field,
                                  form: UseFormReturn
                              }
) {
    const [show, setShow] = useState(!field.showOn);

    // form values
    const watchAll = form.watch();

    useEffect(() => {
        if (field.showOn) {
            const showTemp = Object.keys(field.showOn).every((item) => {
                return field.showOn?.[item].includes(watchAll[item])
            });
            setShow(showTemp);
        } else {
            setShow(true)
        }
    }, [watchAll]);

    useEffect(() => {
        if (!show) {
            form.setValue(field.name, null)
        }
    }, [show]);

    function convertSelectOptions(options: object) {
        return Object.entries(options).map(([code, display]) => ({
            display,
            code
        })) ?? []
    }

    const InputGenerator = useCallback(({props}: { props: ControllerRenderProps }) => {
        const label = field.placeholder ? JSON.parse(field.placeholder).message : '';
        const error = !!(form.formState.errors as any)?.[field.name];
        const helperText = (form.formState.errors as any)?.[field.name]?.message ?? '';

        switch (field.type) {
            case 'text':
            case 'country':
            case 'password': {
                return <TextField {...props}
                                  label={label}
                                  fullWidth
                                  error={error}
                                  helperText={helperText}
                                  inputProps={{
                                      maxLength: field.rules?.maxLength,
                                      readOnly: field.rules?.readOnly
                                  }}
                                  type={field.type}
                                  onChange={(e) => {
                                      props.onChange(e.target.value);
                                  }}
                                  value={props.value ?? ''}
                />
            }
            case 'select': {
                const options = convertSelectOptions(field.options ?? {})
                return <Autocomplete
                    options={options}
                    getOptionLabel={(option) => typeof option === "object" ? option.display : option}
                    isOptionEqualToValue={(option, value: string) => {
                        return option.code === value
                    }}
                    onChange={(_, value) => {
                        props.onChange(value?.code)
                    }}
                    value={props.value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            variant="outlined"
                            error={error}
                            helperText={helperText}
                            inputProps={{
                                ...params.inputProps,
                                readOnly: field.rules?.readOnly
                            }}
                        />
                    )}
                />
            }
            case "checkbox":
                return <FormControlLabel
                    control={<Checkbox
                        {...props}
                        value={props.value ?? ''}
                        checked={!!props.value}
                    />}
                    label={<div dangerouslySetInnerHTML={{__html: JSON.parse(field.caption ?? '').message ?? ''}}/>}
                />
            case "captcha":
                return <FormControlLabel
                    control={<Checkbox
                        {...props}
                        value={props.value ?? ''}
                        checked={!!props.value}
                    />}
                    label={'Captcha'}
                />
            case "datePicker": {
                return <LocalizationProvider dateAdapter={AdapterDayjs}> <DatePicker
                    slotProps={{
                        textField: {
                            error: error,
                            helperText: helperText,
                            fullWidth: true,
                        },
                    }}
                    value={props.value ? dayjs(props.value) : null}
                    onChange={(v) => {
                        props.onChange(v ? v.toISOString() : null);
                    }}
                    label={label}
                />
                </LocalizationProvider>
            }
            case "widget":
                return <Grid container display={'flex'} spacing={1} alignItems="center">
                    {
                        field.fields.map((FieldTemp, index) => (
                            <Fragment key={`field-group-${index}`}>
                                <Input field={FieldTemp} form={form}/>
                            </Fragment>
                        ))
                    }
                </Grid>
            case 'send': {
                return <Button fullWidth variant={'contained'}>{JSON.parse(field.value ?? '').message}</Button>
            }
            case 'submit': {
                return <Button variant={'contained'} type={'submit'}>{JSON.parse(field.value ?? '').message}</Button>
            }
            default: {
                return <></>;
            }
        }
    }, [])

    const rules = useMemo(() => {
        const title = field.placeholder ? JSON.parse(field.placeholder)?.message : '';
        return {
            minLength: field.rules?.minLength
                ? {
                    value: field.rules.minLength,
                    message: `the ${title} length must be at least ${field.rules.minLength}`
                }
                : undefined,
            required: (!['checkbox', 'captcha'].includes(field.type) && field.rules?.required) ? `${title} is required` : false,
            pattern: field.rules?.pattern
                ? {
                    value: new RegExp(field.rules.pattern.regexp ?? '.*'),
                    message: 'format is invalid',
                }
                : undefined,
        }
    }, [])

    return <>
        {
            show && <Grid item
                          xs={field.col ? parseInt(field.col) : 12}
                          order={['submit', 'send'].includes(field.type) ? Number.MAX_SAFE_INTEGER : field.sort}>
                <Controller
                    control={form.control}
                    name={field?.name ?? ''}
                    defaultValue={watchAll[field.name]}
                    rules={rules}
                    render={({field: fieldTemp}) => {
                        return <InputGenerator props={fieldTemp}/>
                    }}
                />
            </Grid>
        }
    </>
}
