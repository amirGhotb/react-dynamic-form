import {useState} from "react";
import FormStep from "./form-step";

export default function FormGenerator({formSteps}: { formSteps: FormStep[] }) {
    const [step, setStep] = useState(0);
    const [payloads, setPayloads] = useState({});
    return <FormStep key={step} formStep={formSteps[step]} onBack={() => {
        step > 0 && setStep(step - 1);
    }} payloads={payloads} onSubmit={(payloadValues: object) => {
        const payloadTemp = {...payloads, ...payloadValues}
        setPayloads(payloadTemp);
        if (step < formSteps.length - 1) {
            setStep(step + 1);
        } else {
            console.log(payloadTemp);
            alert('The payload is logged in the console.');
        }
    }}/>;
}
