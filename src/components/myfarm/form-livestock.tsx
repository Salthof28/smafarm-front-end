'use client'
import { Category, Livestock, UpdateLivestockDto, AllUpdateLivestock, CreateLivestockDto } from "@/types/interfaces";
import { Button, Form, Input, InputNumber, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchCreateLivestock, fetchDeleteImageLivestock, fetchUpdateLivestock, fetchUploadImageLivestock } from "@/services/api";

interface ImageItem {
  id?: number;
  file?: File;
  url: string;
}

interface ImageUpload {
  file: File;
  url: string;
}

interface DeleteImage {
    id: number,
    url: string,
}

interface FormShelterBreederProp {
  category: Category[];
  hiddenForm: () => void;
  statusForm: string;
  livestock?: Livestock;
}

export default function FormLivestockBreeder({ category, hiddenForm, statusForm, livestock }: FormShelterBreederProp) {
    const [form] = Form.useForm();
    const { Option } = Select;
    const {data: session} = useSession();

    // Images state
    const [images, setImages] = useState<ImageItem[]>([]);
    const [newImages, setNewImages] = useState<ImageUpload[]>([]);
    const [deletedImages, setDeletedImages] = useState<DeleteImage[]>([]);

    // Care Give state    

    const [updatedLivestock, setUpdatedLivestock] = useState<Partial<UpdateLivestockDto>>({});

    // populate form saat edit
    useEffect(() => {
        if (livestock && statusForm === "Edit") {
            form.setFieldsValue({
                name: livestock.name,
                location: livestock.location,
                stock: livestock.stock,
                age: livestock.age,
                price: livestock.price,
                description: livestock.description,
                category_id: livestock.category?.id,
            });

            // populate existing images
            const existingImages = livestock.img_livestock?.map(img => ({ id: img.id, url: img.url })) || [];
            setImages(existingImages);

            // populate existing care give
        } else {
            form.resetFields();
            setImages([]);
            setNewImages([]);
            setDeletedImages([]);
            setUpdatedLivestock({});
        }
    }, [livestock, form, statusForm]);

const handleFieldChange = (changedValues: Partial<UpdateLivestockDto>) => {
    if (!livestock) return;

    const trackedFields: (keyof UpdateLivestockDto)[] = [
        "name",
        "location",
        "stock",
        "age",
        "price",
        "description",
        "category_id",
    ];

    setUpdatedLivestock((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(changedValues) as (keyof UpdateLivestockDto)[]) {
            if (trackedFields.includes(key)) {
                let newValue = changedValues[key];
                // Konversi ke number jika field numerik
                if (key === "price" || key === "category_id" || key === "stock" || key === "age") {
                    newValue = newValue !== undefined ? Number(newValue) : undefined;
                }
                const originalValue =
                    key === "price"
                        ? livestock.price
                        : key === "category_id"
                        ? livestock.category?.id
                        : livestock[key as Exclude<keyof Livestock, "category">];

                if (newValue !== originalValue) {
                    updated[key] = newValue as never;
                } else {
                    delete updated[key];
                }
            }
        }
        return updated;
    });
};

    // handle add images baru
    const handleFileChange = (file: File) => {
        const addedImages = { file, url: URL.createObjectURL(file) };
        setImages(prev => [...prev, addedImages]);
        setNewImages(prev => [...prev, addedImages]);
    };

    // handle remove image
        const handleRemoveImage = (index: number) => {
            const removed = images[index];
            if (removed?.id !== undefined) {
                const id: number = removed.id;  
                setDeletedImages(prev => [...prev, { id: id, url: removed.url }]);
            } else {
                setNewImages(prev => prev.filter(img => img !== removed));
            }
            setImages(prev => prev.filter((_, i) => i !== index));
        };
    // === SUBMIT FORM ===
    const handleSubmit = async () => {
        const token = session?.accessToken;
        if(statusForm === "Edit" && livestock && token){
            updated(livestock, token);
        } else if (statusForm === "Create" && token){
            newLivestock(token)
        } else {
            message.error('token not found');
        }
    };

    const updated = async (livestock: Livestock, token: string) => {
        let imagesUrl: string[] = []
        if(newImages.length > 0) {
            const uploadFile = newImages.map(images => images.file);
            const imageJson = await fetchUploadImageLivestock(uploadFile, livestock.id, token);

            if("data"  in imageJson) {
                imagesUrl = imageJson.data.url
                console.log(imagesUrl);
            }
        };
        if(deletedImages.length > 0) {
            const deleteUrl = deletedImages.map(images => images.url);
            const deleteUrlBucket = {
                id: livestock.id,
                url: deleteUrl
            }
            await fetchDeleteImageLivestock(deleteUrlBucket, token);
        };
        const idImgDelete = deletedImages.map(images => images.id);
        const updateData: AllUpdateLivestock = {
            livestock_id: Number(livestock.id),
            livestock: updatedLivestock ? { ...updatedLivestock, id: Number(livestock.id) } : undefined,
            uploadImage: imagesUrl.length > 0 ? imagesUrl : undefined,
            deleteImage: idImgDelete.length > 0 ? idImgDelete : undefined,
        };
        console.log(updateData)
        const fetchUpdate = await fetchUpdateLivestock(updateData, token);
        if(fetchUpdate.success) {
            message.success('Update success')
        } else {
            message.error('Update failed')
        }
        hiddenForm();
    };

    const newLivestock = async (token: string) => {
        const values: CreateLivestockDto = form.getFieldsValue();
        const fetchCreate = await fetchCreateLivestock(values, token);
        if("data" in fetchCreate) {
            message.success('Create success');
        } else {
            message.error('Create failed');
        }
        hiddenForm();
    }

    return (
        <Form form={form} layout="vertical" className="w-full" onFinish={handleSubmit} onValuesChange={handleFieldChange}>
        <h4 className="text-center font-bold mb-4">{statusForm} Livestock</h4>
        {/* Images Upload */}
        {statusForm === "Edit" && (
        <div className="mb-4">
            <label className="font-semibold">Images</label>
            <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover" />
                <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                    onClick={() => handleRemoveImage(idx)}
                >
                    &times;
                </button>
                </div>
            ))}
            </div>
            <Upload
                accept="image/*"
                beforeUpload={(file) => {
                    handleFileChange(file);
                    return false; // supaya Ant Design tidak upload otomatis
                }}
                showUploadList={false}
            >
                <Button className="mt-[0.5rem]" icon={<UploadOutlined />}> Upload Photo
                </Button>
            </Upload>
        </div>
        )}
        {/* Shelter */}
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Kuroge Washu" />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input placeholder="Jl.xxxxx" />
        </Form.Item>

        <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
            <InputNumber className="w-full" placeholder="10" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]} >
            <InputNumber className="w-full" placeholder="20000" />
        </Form.Item>

        <Form.Item label="Age" name="age" rules={[{ required: true }]} >
            <InputNumber className="w-full" placeholder="2" />
        </Form.Item>

        <Form.Item label="Select Category" name="category_id" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
            {category.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
            </Select>
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="description" />
        </Form.Item>

        <div className="flex justify-end gap-2">
            <Button htmlType="button" onClick={hiddenForm} danger>
            Cancel
            </Button>
            <Button htmlType="submit" type="primary">
            {statusForm}
            </Button>
        </div>
        </Form>
    );
}
