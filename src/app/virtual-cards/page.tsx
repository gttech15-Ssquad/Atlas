"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCards } from "@/lib/hooks";
import { useCardStore } from "@/store/cardStore";
import { CARD_STATUS_LABELS } from "@/lib/constants";
import { Plus, Lock, Eye, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function VirtualCardsPage() {
  const { data: cards = [], isLoading } = useCards();
  const { freezeCard, unfreezeCard, deleteCard } = useCardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const filteredCards = useMemo(() => {
    return cards.filter((card: any) => {
      const matchesSearch =
        card.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.maskedNumber.includes(searchTerm);
      const matchesStatus = !filterStatus || card.status === filterStatus;
      const matchesDepartment =
        !filterDepartment || card.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [cards, searchTerm, filterStatus, filterDepartment]);

  const departments = [...new Set(cards.map((c: any) => c.department))];

  const tableRows = filteredCards.map((card: any) => [
    card.nickname,
    card.maskedNumber,
    card.department,
    formatCurrency(card.currentSpend) + " / " + formatCurrency(card.softLimit),
    <Badge
      key={card.id}
      variant={card.status === "active" ? "success" : "warning"}
    >
      {CARD_STATUS_LABELS[card.status] || card.status}
    </Badge>,
    <div key={card.id} className="flex gap-2">
      <Link href={`/virtual-cards/${card.id}`}>
        <Button variant="ghost" size="sm">
          <Eye size={16} />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          card.status === "active" ? freezeCard(card.id) : unfreezeCard(card.id)
        }
      >
        <Lock size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-error"
        onClick={() => deleteCard(card.id)}
      >
        <Trash2 size={16} />
      </Button>
    </div>,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Virtual Cards</h1>
          <p className="text-neutral-600 mt-1">
            Manage your corporate virtual cards
          </p>
        </div>
        <Link href="/virtual-cards/create">
          <Button variant="primary" size="lg">
            <Plus size={18} className="mr-2" />
            Create Card
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by nickname or card number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "frozen", label: "Frozen" },
              ]}
            />
            <Select
              placeholder="Filter by department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              options={departments.map((dept: any) => ({
                value: dept,
                label: dept,
              }))}
            />
          </div>
        </CardBody>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">
            {filteredCards.length} Cards
          </h3>
        </CardHeader>
        <CardBody>
          <Table
            headers={[
              "Card Name",
              "Card Number",
              "Department",
              "Spending",
              "Status",
              "Actions",
            ]}
            rows={tableRows}
          />
        </CardBody>
      </Card>

      {filteredCards.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-neutral-500">No virtual cards found</p>
          <Link href="/virtual-cards/create" className="mt-4">
            <Button variant="primary">Create Your First Card</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
