import { Suspense } from "react";
import RegisterClient from "./registerClient";

export default function Register() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterClient />
        </Suspense>
    )
}