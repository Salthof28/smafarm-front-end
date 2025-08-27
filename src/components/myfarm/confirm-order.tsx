import { fetchUpdateStatusTransactionBreed } from "@/services/api";
import { UpdateStatusTransaction } from "@/types/interfaces";
import { Button, Card, message, Typography } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";



interface ConfirmOrderCustomerProp {
    statusForm: string,
    currentId: number,
    hiddenForm: () => void
}
export default function ConfirmOrderCustomer({statusForm, currentId, hiddenForm}: ConfirmOrderCustomerProp) {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const {data: session} = useSession()
    const token = session?.accessToken;
    if(!token){
        message.error('access token not found please login again')
        return;
    }

    const handleConfirmOrder = async () => {
        setLoadingSubmit(true);
        setTimeout(async () => {
            try {
            const status: UpdateStatusTransaction = {
                status_transaction: statusForm
            }
            const statusTransaction = await fetchUpdateStatusTransactionBreed(currentId, status, token)
            if ("data" in statusTransaction) {
                message.success("Update status transaction successfully!");
                hiddenForm();
            } else {
                message.error(statusTransaction?.message || "Failed to update status transaction.");
            }
            } catch (err) {
            console.error(err);
            message.error("An error occurred while dropping transaction.");
            } finally {
            setLoadingSubmit(false);
            }
        }, 1000);
    };


    return (
        <div>
            {/* Pop-up */}
            <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm p-6 shadow-lg">
                <Typography.Title level={4} className="text-center">Confirm Drop</Typography.Title>
                <Typography.Paragraph className="text-center mb-6">{statusForm === "DECLINE" ? `Are you sure you want to decline this Order?` : `Are you sure you want to accept this Order`}</Typography.Paragraph>
                <div className="flex justify-between gap-4">
                <Button
                    block
                    onClick={hiddenForm}
                    disabled={loadingSubmit}
                >
                    No
                </Button>
                <Button
                    type="primary"
                    danger={statusForm !== "Accept"}
                    block
                    loading={loadingSubmit}
                    onClick={handleConfirmOrder}
                >
                    Yes
                </Button>
                </div>
            </Card>
        </div>
    );
}