"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, Trash2 } from "lucide-react";

export default function SubscriptionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "sub-001",
      vendorName: "Microsoft 365",
      plan: "Enterprise",
      monthlyCost: 250000,
      linkedCard: "**** **** **** 7890",
      nextBillingDate: "2025-12-15",
      status: "active",
    },
    {
      id: "sub-002",
      vendorName: "Adobe Creative Cloud",
      plan: "Team",
      monthlyCost: 180000,
      linkedCard: "**** **** **** 7890",
      nextBillingDate: "2025-12-20",
      status: "active",
    },
  ]);

  const [newSub, setNewSub] = useState({
    vendorName: "",
    plan: "",
    monthlyCost: 0,
  });

  const handleAddSub = () => {
    if (!newSub.vendorName || !newSub.plan || newSub.monthlyCost <= 0) {
      alert("Please fill all fields");
      return;
    }

    const subscription = {
      id: `sub-${Date.now()}`,
      vendorName: newSub.vendorName,
      plan: newSub.plan,
      monthlyCost: newSub.monthlyCost,
      linkedCard: "**** **** **** 7890",
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "active" as const,
    };

    setSubscriptions([...subscriptions, subscription]);
    setNewSub({ vendorName: "", plan: "", monthlyCost: 0 });
    setShowModal(false);
  };

  const handleRemoveSub = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const totalMonthlyCost = subscriptions.reduce(
    (sum, s) => sum + s.monthlyCost,
    0
  );
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Subscriptions</h1>
          <p className="text-neutral-600 mt-1">
            Manage all vendor subscriptions and billing
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-neutral-600 text-sm mb-2">Total Subscriptions</p>
          <p className="text-2xl font-bold text-neutral-900">
            {subscriptions.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-neutral-600 text-sm mb-2">Active</p>
          <p className="text-2xl font-bold text-neutral-900">
            {activeSubscriptions}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-neutral-600 text-sm mb-2">Monthly Cost</p>
          <p className="text-2xl font-bold text-neutral-900">
            ₦{totalMonthlyCost.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-neutral-600 text-sm mb-2">Annual Cost</p>
          <p className="text-2xl font-bold text-neutral-900">
            ₦{(totalMonthlyCost * 12).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Active Subscriptions
          </h2>
        </CardHeader>
        <CardBody>
          {subscriptions.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">
              No subscriptions yet
            </p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      {sub.vendorName}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Plan: {sub.plan} • Next Billing: {sub.nextBillingDate}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-neutral-900">
                      ₦{sub.monthlyCost.toLocaleString()}/mo
                    </p>
                    <Badge variant="success" className="mt-1 inline-block">
                      {sub.status}
                    </Badge>
                  </div>
                  <button
                    onClick={() => handleRemoveSub(sub.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Subscription"
      >
        <div className="space-y-4">
          <Input
            label="Vendor Name"
            placeholder="e.g., Microsoft 365"
            value={newSub.vendorName}
            onChange={(e) =>
              setNewSub({ ...newSub, vendorName: e.target.value })
            }
          />
          <Input
            label="Plan"
            placeholder="e.g., Enterprise"
            value={newSub.plan}
            onChange={(e) => setNewSub({ ...newSub, plan: e.target.value })}
          />
          <Input
            label="Monthly Cost (₦)"
            type="number"
            placeholder="250000"
            value={newSub.monthlyCost || ""}
            onChange={(e) =>
              setNewSub({
                ...newSub,
                monthlyCost: parseFloat(e.target.value) || 0,
              })
            }
          />
          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSub} className="flex-1">
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
