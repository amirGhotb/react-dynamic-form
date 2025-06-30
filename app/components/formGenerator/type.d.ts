type FieldRule = {
    minLength?: number,
    maxLength?: number,
    required?: boolean,
    readOnly?: boolean,
    message?: string,
    pattern?: {
        regexp?: string,
        message?: string,
    },

}
type Field = {
    fields: Field[];
    display?: string,
    col?: string,
    type: "text" | 'password' | 'select' | 'widget' | 'datePicker' | 'checkbox' | 'captcha' | 'country' | 'submit' | 'send',
    caption: string | null,
    hint: string | null,
    name: string,
    value: string | null,
    placeholder: string,
    rules: FieldRule,
    sort: 1,
    dir: string,
    options?: object,
    showOn?: {
        [key: string]: any;
    }
}

type FormStep = {
    title: string;
    hideFields: string[];
    fields: Field[];
    back: boolean;
}
