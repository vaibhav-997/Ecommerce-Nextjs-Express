"use client"

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UpdateProduct({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [image, setImage] = useState<FileList | string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formSchema = z.object({
    productName: z.string().min(2).max(50),
    productPrice: z.string(),
    productSize: z.string(),
    productDescription: z.string().min(6),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productPrice: "",
      productDescription: "",
      productSize: "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files);
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/product/get-product-by-id/${params.id}`);
      form.setValue("productDescription", res.data.payload.description);
      form.setValue("productName", res.data.payload.name);
      form.setValue("productPrice", res.data.payload.price);
      form.setValue("productSize", res.data.payload.size);
      setImage(res.data.payload.image);
      setImagePreview(`/uploads/${res.data.payload.image.split('\\')[4]}`);
    } catch (error) {
      console.warn(error);
      toast({
        title: "Failed",
        description: "Failed to get product",
        variant: "destructive",
      });
      form.reset();
      setImage(null);
      setImagePreview(null);
    }
  };

  useEffect(() => {
    getProduct();
  }, [params.id]);

  async function updateProduct(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      console.log(image);
      let formData = new FormData();
      formData.append("name", values.productName);
      formData.append("description", values.productDescription);
      formData.append("price", values.productPrice);
      formData.append("size", values.productSize);
      if (image && typeof image !== "string") {
        formData.append("image", image[0]);
      }
      const res = await axios.post(`http://localhost:8000/api/product/update-product/${params.id}`, formData);
      toast({
        title: "Success",
        description: res.data?.message,
      });
      form.reset();
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.warn(error);
      toast({
        title: "Failed",
        description: "Failed to update product",
        variant: "destructive",
      });
      form.reset();
      setImage(null);
      setImagePreview(null);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto w-full max-w-screen-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Update Product</CardTitle>
          <CardDescription className="text-center">

            Enter your information to update the product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateProduct)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Description" {...field}></Textarea>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Price" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Size</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Product Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">Small</SelectItem>
                            <SelectItem value="M">Medium</SelectItem>
                            <SelectItem value="L">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2">
                  <Input type="file" onChange={handleImageChange} />
                  {imagePreview && (
                    <div>
                      <img width={600} src={imagePreview} alt="product" />
                    </div>
                  )}
                </div>
                <Button className="w-full" type="submit">Update Product</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
