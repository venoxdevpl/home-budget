import { Button } from "~/components/Button";
import { InputField } from "~/components/InputField";

export function Welcome() {
    return (
        <div>
            <InputField label="E-mail" placeholder="Podaj adres e-mail" required={true} onChange={() => {}} />
            <Button type="button" disabled={true}>
                Submit
            </Button>
        </div>
    );
}
