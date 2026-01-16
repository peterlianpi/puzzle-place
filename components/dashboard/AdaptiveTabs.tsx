"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AdaptiveTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function AdaptiveTabs({ tabs, defaultValue, className }: AdaptiveTabsProps) {
  const [tabOrder, setTabOrder] = useState(tabs.map(tab => tab.id));
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.id);
  const [isMounted, setIsMounted] = useState(false);

  // Load tab usage from localStorage
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedUsage: Record<string, number> = {};
      tabs.forEach(tab => {
        const usage = localStorage.getItem(`tab-${tab.id}-usage`);
        storedUsage[tab.id] = usage ? parseInt(usage, 10) : 0;
      });

      // Sort tabs by usage (most used first)
      const sortedOrder = tabs
        .map(tab => tab.id)
        .sort((a, b) => (storedUsage[b] || 0) - (storedUsage[a] || 0));

      setTabOrder(sortedOrder);
    }
  }, [tabs]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (typeof window !== 'undefined') {
      // Update usage count
      const currentUsage = localStorage.getItem(`tab-${value}-usage`);
      const newUsage = (currentUsage ? parseInt(currentUsage, 10) : 0) + 1;
      localStorage.setItem(`tab-${value}-usage`, newUsage.toString());

      // Re-sort if needed
      const updatedUsage: Record<string, number> = {};
      tabs.forEach(tab => {
        const usage = localStorage.getItem(`tab-${tab.id}-usage`);
        updatedUsage[tab.id] = usage ? parseInt(usage, 10) : 0;
      });

      const newOrder = tabs
        .map(tab => tab.id)
        .sort((a, b) => (updatedUsage[b] || 0) - (updatedUsage[a] || 0));

      setTabOrder(newOrder);
    }
  };

  const orderedTabs = tabOrder.map(id => tabs.find(tab => tab.id === id)!);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={className}>
      <TabsList className="grid w-full grid-cols-3">
        {orderedTabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TabsTrigger value={tab.id} className="relative">
              {tab.label}
              {/* Show usage indicator for frequently used tabs */}
              {isMounted && typeof window !== 'undefined' &&
               localStorage.getItem(`tab-${tab.id}-usage`) &&
               parseInt(localStorage.getItem(`tab-${tab.id}-usage`)!) > 3 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </TabsTrigger>
          </motion.div>
        ))}
      </TabsList>

      {orderedTabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}