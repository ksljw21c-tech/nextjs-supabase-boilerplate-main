/**
 * @file components/order-form.tsx
 * @description 주문 정보 입력 폼 컴포넌트
 *
 * 배송 주소 및 주문 메모를 입력하는 폼
 * react-hook-form과 Zod를 사용한 유효성 검사 포함
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ShippingAddress } from "@/types/order";

const orderFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다."),
  postalCode: z.string().min(1, "우편번호를 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  detailAddress: z.string().min(1, "상세주소를 입력해주세요."),
  orderNote: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  onSubmit: (data: {
    shippingAddress: ShippingAddress;
    orderNote?: string | null;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export default function OrderForm({
  onSubmit,
  isSubmitting = false,
}: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      postalCode: "",
      address: "",
      detailAddress: "",
      orderNote: "",
    },
  });

  const handleSubmit = async (data: OrderFormValues) => {
    const shippingAddress: ShippingAddress = {
      name: data.name,
      phone: data.phone,
      postalCode: data.postalCode,
      address: data.address,
      detailAddress: data.detailAddress,
    };

    await onSubmit({
      shippingAddress,
      orderNote: data.orderNote || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">배송 정보</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>받는 분 이름 *</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="010-1234-5678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우편번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="서울시 강남구 테헤란로 123"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상세주소 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123동 456호"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">주문 메모 (선택사항)</h3>

          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>배송 시 요청사항</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 문 앞에 놓아주세요"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "주문 처리 중..." : "주문하기"}
        </Button>
      </form>
    </Form>
  );
}

