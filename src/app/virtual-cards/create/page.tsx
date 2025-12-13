// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardBody } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
// import { Alert } from "@/components/ui/Alert";
// import { CardPreview } from "@/components/cards/CardPreview";
// import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
// import { useCreateCard } from "@/lib/hooks";
// import { useAuthStore } from "@/store/authStore";
// import { DEPARTMENTS, MERCHANT_CATEGORIES } from "@/lib/constants";
// import {
//   generateCardNumber,
//   generateCVV,
//   generateExpiryDate,
// } from "@/lib/utils";
// import { ArrowLeft, Check } from "lucide-react";
// import Link from "next/link";

// interface FormData {
//   nickname: string;
//   department: string;
//   softLimit: string;
//   hardLimit: string;
//   merchantCategories: string[];
//   internationalTransactions: boolean;
// }

// interface FormErrors {
//   nickname?: string;
//   department?: string;
//   softLimit?: string;
//   hardLimit?: string;
//   merchantCategories?: string;
//   internationalTransactions?: string;
// }

// export default function CreateCardPage() {
//   const router = useRouter();
//   const createCardMutation = useCreateCard();
//   const auth = useAuthStore();
//   const [formData, setFormData] = useState<FormData>({
//     nickname: "",
//     department: "",
//     softLimit: "",
//     hardLimit: "",
//     merchantCategories: [],
//     internationalTransactions: false,
//   });

//   const [cardPreview, setCardPreview] = useState({
//     cardNumber: generateCardNumber(),
//     cvv: generateCVV(),
//     expiryDate: generateExpiryDate(),
//   });

//   const [showMultiSig, setShowMultiSig] = useState(false);
//   const [showCVV, setShowCVV] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.nickname.trim()) {
//       newErrors.nickname = "Card nickname is required";
//     }

//     if (!formData.department) {
//       newErrors.department = "Department is required";
//     }

//     if (!formData.softLimit || isNaN(Number(formData.softLimit))) {
//       newErrors.softLimit = "Valid soft limit is required";
//     }

//     if (!formData.hardLimit || isNaN(Number(formData.hardLimit))) {
//       newErrors.hardLimit = "Valid hard limit is required";
//     }

//     if (
//       Number(formData.softLimit) > 0 &&
//       Number(formData.hardLimit) > 0 &&
//       Number(formData.softLimit) > Number(formData.hardLimit)
//     ) {
//       newErrors.softLimit = "Soft limit cannot exceed hard limit";
//     }

//     if (formData.merchantCategories.length === 0) {
//       newErrors.merchantCategories =
//         "At least one merchant category must be selected";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleMerchantToggle = (category: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       merchantCategories: prev.merchantCategories.includes(category)
//         ? prev.merchantCategories.filter((m) => m !== category)
//         : [...prev.merchantCategories, category],
//     }));
//   };

//   const handleRegenerateCard = () => {
//     setCardPreview({
//       cardNumber: generateCardNumber(),
//       cvv: generateCVV(),
//       expiryDate: generateExpiryDate(),
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setShowMultiSig(true);
//     }
//   };

//   const handleMultiSigApprove = async () => {
//     try {
//       const payload = {
//         cardholderName: auth.user?.name ?? "Corporate Card",
//         nickname: formData.nickname || undefined,
//         departmentId: null,
//         cardType: "CREDIT",
//         currency: "NGN",
//         allowInternational: formData.internationalTransactions,
//       };

//       const created = await createCardMutation.mutateAsync(payload);

//       setShowMultiSig(false);

//       const cardId = created?.id ?? created?.cardId ?? created?.Id;
//       if (cardId) {
//         router.push(`/virtual-cards/${cardId}`);
//       } else {
//         router.push("/virtual-cards");
//       }
//     } catch (err) {
//       console.error("Create card failed", err);
//       setShowMultiSig(false);
//       router.push("/virtual-cards");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Link href="/virtual-cards">
//           <Button variant="outline" size="sm">
//             <ArrowLeft size={16} />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold text-neutral-900">
//             Create Virtual Card
//           </h1>
//           <p className="text-neutral-600 mt-1">
//             Create a new corporate virtual card with spending limits and
//             controls
//           </p>
//         </div>
//       </div>

//       {/* Alert */}
//       <Alert
//         type="info"
//         title="Multi-Signatory Required"
//         message="Card creation requires CEO and CFO approval with OTP verification"
//       />

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <h2 className="text-lg font-semibold text-neutral-900">
//                 Card Configuration
//               </h2>
//             </CardHeader>
//             <CardBody>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Information */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-neutral-900 mb-4">
//                     Basic Information
//                   </h3>
//                   <div className="space-y-4">
//                     <Input
//                       label="Card Nickname"
//                       name="nickname"
//                       value={formData.nickname}
//                       onChange={handleInputChange}
//                       placeholder="e.g., Marketing Team Card"
//                       error={errors.nickname}
//                     />

//                     <Select
//                       label="Department"
//                       name="department"
//                       value={formData.department}
//                       onChange={handleInputChange}
//                       options={[
//                         { value: "", label: "Select Department" },
//                         ...DEPARTMENTS.map((dept) => ({
//                           value: dept,
//                           label: dept,
//                         })),
//                       ]}
//                       error={errors.department}
//                       placeholder="Select Department"
//                     />
//                   </div>
//                 </div>

//                 {/* Spending Limits */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-neutral-900 mb-4">
//                     Spending Limits
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <Input
//                       label="Soft Limit (₦)"
//                       name="softLimit"
//                       type="number"
//                       value={formData.softLimit}
//                       onChange={handleInputChange}
//                       placeholder="e.g., 400000"
//                       error={errors.softLimit}
//                     />
//                     <Input
//                       label="Hard Limit (₦)"
//                       name="hardLimit"
//                       type="number"
//                       value={formData.hardLimit}
//                       onChange={handleInputChange}
//                       placeholder="e.g., 500000"
//                       error={errors.hardLimit}
//                     />
//                   </div>
//                   <p className="text-xs text-neutral-500 mt-2">
//                     Soft limit generates warnings, hard limit blocks
//                     transactions
//                   </p>
//                 </div>

//                 {/* Merchant Categories */}
//                 {/* <div>
//                   <h3 className="text-sm font-semibold text-neutral-900 mb-4">
//                     Allowed Merchant Categories
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3">
//                     {MERCHANT_CATEGORIES.map((category) => (
//                       <label
//                         key={category}
//                         className="flex items-center gap-2 p-2 rounded border border-neutral-200 hover:border-orange-500 cursor-pointer transition"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.merchantCategories.includes(
//                             category
//                           )}
//                           onChange={() => handleMerchantToggle(category)}
//                           className="rounded"
//                         />
//                         <span className="text-sm text-neutral-700">
//                           {category}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                   {errors.merchantCategories && (
//                     <p className="text-xs text-red-500 mt-2">
//                       {errors.merchantCategories}
//                     </p>
//                   )}
//                 </div> */}

//                 {/* International Transactions */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-neutral-900 mb-4">
//                     Additional Controls
//                   </h3>
//                   <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
//                     <input
//                       type="checkbox"
//                       name="internationalTransactions"
//                       checked={formData.internationalTransactions}
//                       onChange={handleInputChange}
//                       className="rounded"
//                     />
//                     <div>
//                       <p className="font-medium text-neutral-900">
//                         Allow International Transactions
//                       </p>
//                       <p className="text-xs text-neutral-600">
//                         Enable transactions in foreign currencies
//                       </p>
//                     </div>
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-4 border-t border-neutral-200">
//                   <Button type="submit" variant="primary" className="w-full">
//                     <Check size={16} className="mr-2" />
//                     Proceed to Multi-Signatory Approval
//                   </Button>
//                 </div>
//               </form>
//             </CardBody>
//           </Card>
//         </div>

//         {/* Card Preview */}
//         <div className="space-y-4">
//           <Card>
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-neutral-900">
//                 Card Preview
//               </h3>
//             </CardHeader>
//             <CardBody className="space-y-4">
//               <CardPreview
//                 cardNumber={cardPreview.cardNumber}
//                 expiryDate={cardPreview.expiryDate}
//                 cvv={cardPreview.cvv}
//                 cardholderName="CORPORATE CARD"
//                 department={formData.department || "CORPORATE"}
//                 showCVV={showCVV}
//                 onShowCVV={setShowCVV}
//               />

//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleRegenerateCard}
//               >
//                 Regenerate Card Details
//               </Button>
//             </CardBody>
//           </Card>

//           {/* Summary */}
//           <Card>
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-neutral-900">
//                 Summary
//               </h3>
//             </CardHeader>
//             <CardBody className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-neutral-600">Nickname:</span>
//                 <span className="font-medium text-neutral-900">
//                   {formData.nickname || "-"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-neutral-600">Department:</span>
//                 <span className="font-medium text-neutral-900">
//                   {formData.department || "-"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-neutral-600">Soft Limit:</span>
//                 <span className="font-medium text-neutral-900">
//                   {formData.softLimit
//                     ? `₦${Number(formData.softLimit).toLocaleString()}`
//                     : "-"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-neutral-600">Hard Limit:</span>
//                 <span className="font-medium text-neutral-900">
//                   {formData.hardLimit
//                     ? `₦${Number(formData.hardLimit).toLocaleString()}`
//                     : "-"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-neutral-600">Int'l Transactions:</span>
//                 <span className="font-medium text-neutral-900">
//                   {formData.internationalTransactions
//                     ? "✓ Allowed"
//                     : "✗ Blocked"}
//                 </span>
//               </div>
//               <div className="border-t border-neutral-200 pt-3">
//                 <span className="text-neutral-600">Categories:</span>
//                 <div className="flex flex-wrap gap-1 mt-2">
//                   {formData.merchantCategories.length > 0 ? (
//                     formData.merchantCategories.map((cat) => (
//                       <span
//                         key={cat}
//                         className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
//                       >
//                         {cat}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-neutral-500 text-xs">
//                       None selected
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>

//       {/* Multi-Signatory Modal */}
//       <MultiSignatoryModal
//         isOpen={showMultiSig}
//         onClose={() => setShowMultiSig(false)}
//         onApprove={handleMultiSigApprove}
//         cardNickname={formData.nickname}
//         action="CREATE_CARD"
//       />
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { CardPreview } from "@/components/cards/CardPreview";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
import { useCreateCard } from "@/lib/hooks";
import { useAuthStore } from "@/store/authStore";
// Removed DEPARTMENTS from imports since we are using the local list
import { MERCHANT_CATEGORIES } from "@/lib/constants";
import {
  generateCardNumber,
  generateCVV,
  generateExpiryDate,
} from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

// --- 1. NEW DATA SOURCE ---
const DEPARTMENT_LIST = [
  {
    id: "14e2308d-e00c-4ae4-b2db-bd29f9cc517c",
    name: "Compliance",
    budget: 200000,
  },
  {
    id: "2767bd6b-bd56-4414-949a-1ad1c71a601a",
    name: "Sales",
    budget: 600000,
  },
  {
    id: "58d15082-8fad-4337-b972-ca04d292a658",
    name: "Risk Management",
    budget: 300000,
  },
  {
    id: "6cbc73f2-c2ae-4399-aee0-aeee9102cd2a",
    name: "Finance",
    budget: 500000,
  },
  {
    id: "859f0e44-e20a-4662-b8e4-31a016ad685e",
    name: "Operations",
    budget: 400000,
  },
  {
    id: "b25e7b65-f56b-4278-8da0-67ab7a0abdc0",
    name: "IT",
    budget: 250000,
  },
  {
    id: "d1b4a0e8-55f4-4d1a-b044-f52af7ebd3a3",
    name: "Marketing",
    budget: 350000,
  },
  {
    id: "d77597cc-8705-4746-905f-aa0e2ae4d80d",
    name: "HR",
    budget: 300000,
  },
];

interface FormData {
  nickname: string;
  departmentId: string; // Changed from department name to ID
  softLimit: string;
  hardLimit: string;
  merchantCategories: string[];
  internationalTransactions: boolean;
}

interface FormErrors {
  nickname?: string;
  departmentId?: string;
  softLimit?: string;
  hardLimit?: string;
  merchantCategories?: string;
  internationalTransactions?: string;
}

export default function CreateCardPage() {
  const router = useRouter();
  const createCardMutation = useCreateCard();
  const auth = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    departmentId: "", // Initialize as empty string
    softLimit: "",
    hardLimit: "",
    merchantCategories: [],
    internationalTransactions: false,
  });

  // Helper to get the full department object for display purposes
  const selectedDept = DEPARTMENT_LIST.find(
    (d) => d.id === formData.departmentId
  );

  const [cardPreview, setCardPreview] = useState({
    cardNumber: generateCardNumber(),
    cvv: generateCVV(),
    expiryDate: generateExpiryDate(),
  });

  const [showMultiSig, setShowMultiSig] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Card nickname is required";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    if (!formData.softLimit || isNaN(Number(formData.softLimit))) {
      newErrors.softLimit = "Valid soft limit is required";
    }

    if (!formData.hardLimit || isNaN(Number(formData.hardLimit))) {
      newErrors.hardLimit = "Valid hard limit is required";
    }

    if (
      Number(formData.softLimit) > 0 &&
      Number(formData.hardLimit) > 0 &&
      Number(formData.softLimit) > Number(formData.hardLimit)
    ) {
      newErrors.softLimit = "Soft limit cannot exceed hard limit";
    }

    // Temporarily disabled merchant category validation if commented out in UI
    /* if (formData.merchantCategories.length === 0) {
      newErrors.merchantCategories = "At least one merchant category must be selected";
    } 
    */

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleMerchantToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      merchantCategories: prev.merchantCategories.includes(category)
        ? prev.merchantCategories.filter((m) => m !== category)
        : [...prev.merchantCategories, category],
    }));
  };

  const handleRegenerateCard = () => {
    setCardPreview({
      cardNumber: generateCardNumber(),
      cvv: generateCVV(),
      expiryDate: generateExpiryDate(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowMultiSig(true);
    }
  };

  const handleMultiSigApprove = async () => {
    try {
      const payload = {
        cardholderName: auth.user?.name ?? "Corporate Card",
        nickname: formData.nickname || undefined,
        departmentId: formData.departmentId, // 2. USE ID HERE
        cardType: "CREDIT",
        currency: "NGN",
        allowInternational: formData.internationalTransactions,
      };

      const created = await createCardMutation.mutateAsync(payload);

      setShowMultiSig(false);

      const cardId = created?.id ?? created?.cardId ?? created?.Id;
      if (cardId) {
        router.push(`/virtual-cards/${cardId}`);
      } else {
        router.push("/virtual-cards");
      }
    } catch (err) {
      console.error("Create card failed", err);
      setShowMultiSig(false);
      router.push("/virtual-cards");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/virtual-cards">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Create Virtual Card
          </h1>
          <p className="text-neutral-600 mt-1">
            Create a new corporate virtual card with spending limits and
            controls
          </p>
        </div>
      </div>

      {/* Alert */}
      <Alert
        type="info"
        title="Multi-Signatory Required"
        message="Card creation requires CEO and CFO approval with OTP verification"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Card Configuration
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Card Nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="e.g., Marketing Team Card"
                      error={errors.nickname}
                    />

                    {/* 3. UPDATED SELECT COMPONENT */}
                    <Select
                      label="Department"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      options={[
                        { value: "", label: "Select Department" },
                        ...DEPARTMENT_LIST.map((dept) => ({
                          value: dept.id, // Value is the ID
                          label: dept.name, // Label is the Name
                        })),
                      ]}
                      error={errors.departmentId}
                      placeholder="Select Department"
                    />
                  </div>
                </div>

                {/* Spending Limits */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Spending Limits
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Soft Limit (₦)"
                      name="softLimit"
                      type="number"
                      value={formData.softLimit}
                      onChange={handleInputChange}
                      placeholder="e.g., 400000"
                      error={errors.softLimit}
                    />
                    <Input
                      label="Hard Limit (₦)"
                      name="hardLimit"
                      type="number"
                      value={formData.hardLimit}
                      onChange={handleInputChange}
                      placeholder="e.g., 500000"
                      error={errors.hardLimit}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Soft limit generates warnings, hard limit blocks
                    transactions
                  </p>
                </div>

                {/* International Transactions */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Additional Controls
                  </h3>
                  <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
                    <input
                      type="checkbox"
                      name="internationalTransactions"
                      checked={formData.internationalTransactions}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Allow International Transactions
                      </p>
                      <p className="text-xs text-neutral-600">
                        Enable transactions in foreign currencies
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-neutral-200">
                  <Button type="submit" variant="primary" className="w-full">
                    <Check size={16} className="mr-2" />
                    Proceed to Multi-Signatory Approval
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Card Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">
                Card Preview
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <CardPreview
                cardNumber={cardPreview.cardNumber}
                expiryDate={cardPreview.expiryDate}
                cvv={cardPreview.cvv}
                cardholderName="CORPORATE CARD"
                // 4. DISPLAY NAME IN PREVIEW (fallback to ID or default)
                department={selectedDept ? selectedDept.name : "CORPORATE"}
                showCVV={showCVV}
                onShowCVV={setShowCVV}
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegenerateCard}
              >
                Regenerate Card Details
              </Button>
            </CardBody>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">
                Summary
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Nickname:</span>
                <span className="font-medium text-neutral-900">
                  {formData.nickname || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Department:</span>
                <span className="font-medium text-neutral-900">
                  {/* 4. DISPLAY NAME IN SUMMARY */}
                  {selectedDept ? selectedDept.name : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Soft Limit:</span>
                <span className="font-medium text-neutral-900">
                  {formData.softLimit
                    ? `₦${Number(formData.softLimit).toLocaleString()}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Hard Limit:</span>
                <span className="font-medium text-neutral-900">
                  {formData.hardLimit
                    ? `₦${Number(formData.hardLimit).toLocaleString()}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Int'l Transactions:</span>
                <span className="font-medium text-neutral-900">
                  {formData.internationalTransactions
                    ? "✓ Allowed"
                    : "✗ Blocked"}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <span className="text-neutral-600">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.merchantCategories.length > 0 ? (
                    formData.merchantCategories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500 text-xs">
                      None selected
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Multi-Signatory Modal */}
      <MultiSignatoryModal
        isOpen={showMultiSig}
        onClose={() => setShowMultiSig(false)}
        onApprove={handleMultiSigApprove}
        cardNickname={formData.nickname}
        action="CREATE_CARD"
      />
    </div>
  );
}
