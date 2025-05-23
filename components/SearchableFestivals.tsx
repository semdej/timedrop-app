"use client";

import { useState, useMemo } from "react";
import { SimpleGrid, TextInput, Text, Space } from "@mantine/core";
import { FestiCard } from "./FestiCard";

export default function SearchableFestivals({
  festivals,
}: {
  festivals: any[];
}) {
  const [search, setSearch] = useState("");

  const filteredFestivals = useMemo(() => {
    const query = search.toLowerCase();
    return festivals.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.location.toLowerCase().includes(query)
    );
  }, [search, festivals]);

  return (
    <>
      <TextInput
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Space h="xl" />

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="lg"
        verticalSpacing="xl"
      >
        {filteredFestivals.map((festival) => {
          const start = new Date(festival.start_date);
          const daysLeft = Math.max(
            0,
            Math.ceil((start.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          );

          return (
            <FestiCard
              key={festival.id}
              title={festival.name}
              slug={festival.slug}
              description={`Location: ${festival.location}`}
              daysLeft={daysLeft}
              logourl={festival.logourl}
            />
          );
        })}
      </SimpleGrid>

      {filteredFestivals.length === 0 && (
        <Text mt="lg">No festivals found.</Text>
      )}
    </>
  );
}
