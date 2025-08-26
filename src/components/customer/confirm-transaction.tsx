import { fetchDropTransaction, fetchReviewTransaction } from "@/services/api";
import { Button, Card, Form, message, Modal, Rate, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ReviewTransaction {
    rating: number,
    review: string
}

interface ConfirmFormTransactionCustomerProp {
    statusForm: string,
    currentId: number,
    hiddenForm: () => void
}
export default function ConfirmFormTransactionCustomer({statusForm, currentId, hiddenForm}: ConfirmFormTransactionCustomerProp) {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const {data: session} = useSession()
    const token = session?.accessToken;
    if(!token){
        message.error('access token not found please login again')
        return;
    }
    if(statusForm === "Finish") {
        const [form] = Form.useForm();
        const [rating, setRating] = useState<number>(0);


        const handleFinish = async (values: ReviewTransaction) => {

            // const values = form.getFieldsValue();
            console.log(`rating: ${values.rating}`);
            console.log(`review: ${values.review}`);
            const dataReview: ReviewTransaction = {
                rating: values.rating,
                review: values.review
            };
            try {
                setLoadingSubmit(true);
                const reviewFetch = await fetchReviewTransaction(currentId, dataReview, token);
                if ("data" in reviewFetch) {
                    message.success("review successfully!");
                    hiddenForm();
                } else {
                    message.error(reviewFetch?.message || "Failed to update schedule.");
                }
            } catch (err) {
                console.error(err);
                message.error("An error occurred while send your review.");
            } finally {
                setLoadingSubmit(false);
                hiddenForm()
            }


        };
        return (
            <Card className="max-w-md mx-auto shadow-md rounded-xl">
            <h4 className="text-xl font-semibold mb-4 text-center">Give Your Rating</h4>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ review: "", rating: 0 }}
            >
                <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: "Please select your rating!" }]}
                >
                    <Rate value={rating} onChange={setRating} />
                </Form.Item>

                <Form.Item
                name="review"
                label="Review"
                // rules={[
                //     { message: "Please write your review!" },
                //     { message: "Review must be at least 5 characters." },
                // ]}
                >
                <TextArea rows={4} placeholder="Write your review here..." />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                    Submit
                </Button>
                </Form.Item>
            </Form>
            </Card>
        );
    }
    return (
        <>

            {/* Pop-up */}
            <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm p-6 shadow-lg">
                <Typography.Title level={4} className="text-center">Confirm Drop</Typography.Title>
                <Typography.Paragraph className="text-center mb-6">Are you sure you want to drop this transaction?</Typography.Paragraph>
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
                    danger
                    block
                    loading={loadingSubmit}
                    onClick={async () => {
                    setLoadingSubmit(true);
                    // panggil API Drop di sini
                    setTimeout(async () => {
                        try {
                            setLoadingSubmit(true);
                            const dropFetch = await fetchDropTransaction(currentId, token);
                            if ("data" in dropFetch) {
                                message.success("Transaction drop successfully!");
                                hiddenForm();
                            } else {
                                message.error(dropFetch?.message || "Failed to update schedule.");
                            }
                        } catch (err) {
                            console.error(err);
                            message.error("An error occurred while send your review.");
                        } finally {
                            setLoadingSubmit(false);
                            hiddenForm()
                        }
                    }, 1000);
                    }}
                >
                    Yes
                </Button>
                </div>
            </Card>
        </>
    );

}