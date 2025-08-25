'use client'
import { Category, Shelter, CareGive, AllUpdateShelter, CreateCareDto, UpdateShelterDto, CreateShelter } from "@/types/interfaces";
import { Button, Form, Input, InputNumber, Select, Collapse, Switch, Upload, message } from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchCreateShelter, fetchDeleteImageShelter, fetchUpdateShelter, fetchUploadImageShelter } from "@/services/api";
import { useSession } from "next-auth/react";

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
  shelter?: Shelter;
}

export default function FormShelterBreeder({ category, hiddenForm, statusForm, shelter }: FormShelterBreederProp) {
    const [form] = Form.useForm();
    const { Option } = Select;
    const { Panel } = Collapse;
    const {data: session} = useSession();

    // Images state
    const [images, setImages] = useState<ImageItem[]>([]);
    const [newImages, setNewImages] = useState<ImageUpload[]>([]);
    const [deletedImages, setDeletedImages] = useState<DeleteImage[]>([]);

    // Care Give state    
    const [careGive, setCareGive] = useState<CareGive[]>([]);
    const [newCareGive, setNewCareGive] = useState<Partial<CreateCareDto>[]>([]);
    const [deletedCareGive, setDeletedCareGive] = useState<number[]>([]);
    const [updatedCareGive, setUpdatedCareGive] = useState<CareGive[]>([]);

    const [updatedShelter, setUpdatedShelter] = useState<Partial<UpdateShelterDto>>({});

    // populate form saat edit
    useEffect(() => {
        if (shelter && statusForm === "Edit") {
            form.setFieldsValue({
                name: shelter.name,
                location: shelter.location,
                accomodate: shelter.accomodate,
                description: shelter.description,
                price_daily: shelter.price_daily,
                category_id: shelter.category?.id,
                care_give: shelter.care_give || []
            });

            // populate existing images
            const existingImages = shelter.img_shelter?.map(img => ({ id: img.id, url: img.url })) || [];
            setImages(existingImages);

            // populate existing care give
            setCareGive(shelter.care_give || []);
        } else {
            form.resetFields();
            setImages([]);
            setNewImages([]);
            setDeletedImages([]);
            setCareGive([]);
            setNewCareGive([]);
            setDeletedCareGive([]);
            setUpdatedCareGive([]);
            setUpdatedShelter({});
        }
    }, [shelter, form, statusForm]);

const handleFieldChange = (changedValues: Partial<UpdateShelterDto>) => {
    if (!shelter) return;

    const trackedFields: (keyof UpdateShelterDto)[] = [
        "name",
        "location",
        "accomodate",
        "description",
        "price_daily",
        "category_id",
    ];

    setUpdatedShelter((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(changedValues) as (keyof UpdateShelterDto)[]) {
            if (trackedFields.includes(key)) {
                let newValue = changedValues[key];
                // Konversi ke number jika field numerik
                if (key === "price_daily" || key === "category_id" || key === "accomodate") {
                    newValue = newValue !== undefined ? Number(newValue) : undefined;
                }
                const originalValue =
                    key === "price_daily"
                        ? shelter.price_daily
                        : key === "category_id"
                        ? shelter.category?.id
                        : shelter[key as Exclude<keyof Shelter, "category">];

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

    const handleCareChange = () => {
    const currentValues: CareGive[] = form.getFieldValue('care_give') || [];

    // update newCareGive: hanya yg belum ada id
    const newCare = currentValues.filter(c => !c.id).map(c => ({ ...c }));
    setNewCareGive(newCare);

    // update updatedCareGive: hanya care lama yg berubah (ada id)
    const updatedList = currentValues
      .filter(c => c.id)
      .map(c => {
        const original = careGive.find(o => o.id === c.id);
        if (!original) return null;
        const isChanged =
            c.shelter_id !== original.shelter_id ||
            c.name !== original.name ||
            c.price !== original.price ||
            c.unit !== original.unit ||
            c.required !== original.required;
        return isChanged ? c : null;
      })
      .filter(Boolean) as CareGive[];

    setUpdatedCareGive(updatedList);
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

    // handle add care
    const handleAddCare = () => {
        const newCare: Partial<CareGive> = { shelter_id: shelter?.id, name: '', price: 0, unit: '', required: false };
        setCareGive(prev => [...prev, newCare as CareGive]);
        setNewCareGive(prev => [...prev, newCare]);
        const currentCare = form.getFieldValue('care_give') || [];
        form.setFieldsValue({
        care_give: [...currentCare, newCare]
        });
    };

    // handle remove care
    const handleRemoveCare = (index: number) => {
        const removed = form.getFieldValue(['care_give', index]);
        if (removed?.id) {
            setDeletedCareGive(prev => [...prev, removed.id])
        };
        if (!removed?.id) {
            setNewCareGive(prev => prev.filter(c => c !== removed))
        };
        setCareGive(prev => prev.filter((_, i) => i !== index));
        const updatedCare: CareGive[] = (form.getFieldValue('care_give') as CareGive[]).filter((_, i: number) => i !== index);
        form.setFieldsValue({ care_give: updatedCare });
    };
    // === SUBMIT FORM ===
    const handleSubmit = async () => {
        const values: Shelter = form.getFieldsValue();
        console.log("Form Values:", values);
        console.log("Updated Shelter:", updatedShelter);
        console.log("Images:", images);
        console.log("New Images to upload:", newImages);
        console.log("Deleted Images:", deletedImages);
        console.log("Care Give:", careGive);
        console.log("New Care Give:", newCareGive);
        console.log("Updated Care Give:", updatedCareGive);
        console.log("Deleted Care Give:", deletedCareGive);
        const token = session?.accessToken;
        if(statusForm === "Edit" && shelter && token){
            updated(shelter, token);
        } else if (statusForm === "Create" && token){
            newShelter(token)
        } else {
            message.error('token not found');
        }

        // TODO: API call
    };

    const updated = async (shelter: Shelter, token: string) => {
        let imagesUrl: string[] = []
        if(newImages.length > 0) {
            const uploadFile = newImages.map(images => images.file);
            const imageJson = await fetchUploadImageShelter(uploadFile, shelter?.id, token);

            if("data"  in imageJson) {
                imagesUrl = imageJson.data.url
                console.log(imagesUrl);
            }
        };
        if(deletedImages.length > 0) {
            const deleteUrl = deletedImages.map(images => images.url);
            const deleteUrlBucket = {
                id: shelter.id,
                url: deleteUrl
            }
            await fetchDeleteImageShelter(deleteUrlBucket, token);
            // if("data"  in imageJson) {
            //     const dataImage = await imageJson.data.url
            //     console.log(dataImage);
            // }
        };
        const idImgDelete = deletedImages.map(images => images.id);
        const updateData: AllUpdateShelter = {
            shelter_id: Number(shelter.id),
            shelter: updatedShelter ? { ...updatedShelter, id: Number(shelter.id) } : undefined,
            uploadImage: imagesUrl.length > 0 ? imagesUrl : undefined,
            deleteImage: idImgDelete.length > 0 ? idImgDelete : undefined,
            newCare: newCareGive.length > 0 ? newCareGive : undefined,
            updateCare: updatedCareGive.length > 0 ? updatedCareGive : undefined,
            deleteCare: deletedCareGive.length > 0 ? deletedCareGive : undefined
        };
        console.log(updateData)
        const fetchUpdate = await fetchUpdateShelter(updateData, token);
        if(fetchUpdate.success) {
            message.success('Update success')
        } else {
            message.error('Update failed')
        }
        hiddenForm();
    };

    const newShelter = async (token: string) => {
        const values: CreateShelter = form.getFieldsValue();
        const fetchCreate = await fetchCreateShelter(values, token);
        if("data" in fetchCreate) {
            message.success('Create success');
        } else {
            message.error('Create failed');
        }
        hiddenForm();
    }

    return (
        <Form form={form} layout="vertical" className="w-full" onFinish={handleSubmit} onValuesChange={handleFieldChange}>
        <h4 className="text-center font-bold mb-4">{statusForm} Shelter</h4>
        {/* Images Upload */}
        {statusForm === "Edit" && (
        <div className="mb-4">
            <label className="font-semibold">Images</label>
            {/* <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block mt-2 mb-2" /> */}
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
            <Input placeholder="Mulyono Shelter" />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input placeholder="Jl.xxxxx" />
        </Form.Item>

        <Form.Item label="Accomodate" name="accomodate" rules={[{ required: true }]}>
            <InputNumber className="w-full" placeholder="10" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="description" />
        </Form.Item>

        <Form.Item label="Price Common" name="price_daily" rules={[{ required: true }]} >
            <InputNumber className="w-full" placeholder="20000" />
        </Form.Item>

        <Form.Item label="Select Category" name="category_id" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
            {category.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
            </Select>
        </Form.Item>



        {/* CARE GIVE LIST */}
        {statusForm === "Edit" && (
        <Form.List name="care_give">
            {(fields) => (
            <div className="mb-4">
                <Collapse>
                {fields.map(({ key, name, ...restField }, index) => (
                    <Panel
                    header={form.getFieldValue(['care_give', name, 'name']) || `Care ${name + 1}`}
                    key={key}
                    >
                    <Form.Item {...restField} label="Care Name" name={[name, 'name']} rules={[{ required: true }]}>
                        <Input onChange={handleCareChange} />
                    </Form.Item>
                    <Form.Item {...restField} label="Price" name={[name, 'price']} rules={[{ required: true }]}>
                        <InputNumber className="w-full" onBlur={handleCareChange} />
                    </Form.Item>
                    <Form.Item {...restField} label="Unit" name={[name, 'unit']} rules={[{ required: true }]}>
                        {/* <Input onChange={handleCareChange} /> */}
                        <Select placeholder="Select a shelter" onChange={handleCareChange}>
                            <Option value='DAY'>DAY</Option>
                            <Option value='WEEK'>WEEK</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item {...restField} label="Required" name={[name, 'required']} valuePropName="checked">
                        <Switch onChange={handleCareChange} />
                    </Form.Item>
                    <Button
                        type="dashed"
                        danger
                        onClick={() => handleRemoveCare(index)}
                        icon={<MinusCircleOutlined />}
                        className="mt-2"
                    >
                        Remove Care
                    </Button>
                    </Panel>
                ))}
                </Collapse>
                <Button
                type="dashed"
                onClick={handleAddCare}
                icon={<PlusOutlined />}
                className="mt-2"
                >
                Add Care
                </Button>
            </div>
            )}
        </Form.List>
        )}

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
