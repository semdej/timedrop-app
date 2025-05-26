"use client";

import { useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  Title,
  Stack,
  Card,
  Divider,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { IconTrash, IconPlus, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Performance {
  id: string;
  artist_name: string;
  start_time: string;
  end_time: string;
  stage_id: string;
}

interface Stage {
  id: string;
  name: string;
  performances: Performance[];
}

export function AdminFestivalManager({
  festival,
  stages: initialStages,
}: {
  festival: any;
  stages: Stage[];
}) {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [newStageName, setNewStageName] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleAddStage = async () => {
    if (!newStageName.trim()) return;
    const { data, error } = await supabase
      .from("stages")
      .insert({
        name: newStageName,
        festival_id: festival.id,
      })
      .select()
      .single();
    if (!error && data) {
      setStages([...stages, { ...data, performances: [] }]);
      setNewStageName("");
    }
  };

  const handleDeleteStage = async (id: string) => {
    await supabase.from("stages").delete().eq("id", id);
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Stack gap="xl">
      <Card withBorder shadow="sm" radius="md">
        <Stack gap="sm">
          <Title order={4} size="h5">
            Add New Stage
          </Title>
          <Group wrap="wrap" align="flex-end">
            <TextInput
              value={newStageName}
              onChange={(e) => setNewStageName(e.currentTarget.value)}
              placeholder="Stage name"
              w={{ base: "100%", sm: "auto" }}
              flex={1}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleAddStage}
              fullWidth
              mt={{ base: "sm", sm: 0 }}
            >
              Add
            </Button>
          </Group>
        </Stack>
      </Card>

      {stages.map((stage) => (
        <StageTable
          key={stage.id}
          stage={stage}
          onDeleteStage={handleDeleteStage}
        />
      ))}
    </Stack>
  );
}

function StageTable({
  stage,
  onDeleteStage,
}: {
  stage: Stage;
  onDeleteStage: (id: string) => void;
}) {
  const supabase = createClient();
  const [newPerformance, setNewPerformance] = useState("");
  const router = useRouter();

  const handleAddPerformance = async () => {
    if (!newPerformance.trim()) return;
    const { data } = await supabase
      .from("performances")
      .insert({
        artist_name: newPerformance,
        stage_id: stage.id,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (data) {
      stage.performances.push(data);
      setNewPerformance("");
      router.refresh();
    }
  };

  const handleUpdatePerformance = async (p: Performance) => {
    await supabase
      .from("performances")
      .update({
        artist_name: p.artist_name,
        start_time: p.start_time,
        end_time: p.end_time,
      })
      .eq("id", p.id);
    router.refresh();
  };

  const handleDeletePerformance = async (id: string) => {
    await supabase.from("performances").delete().eq("id", id);
    stage.performances = stage.performances.filter((p) => p.id !== id);
    router.refresh();
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack>
        <Group justify="space-between" wrap="wrap">
          <Title order={4} size="h5">
            {stage.name}
          </Title>
          <ActionIcon
            color="red"
            variant="light"
            onClick={() => onDeleteStage(stage.id)}
            mt={{ base: "sm", sm: 0 }}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>

        <Divider />

        <ScrollArea>
          <Table
            striped
            highlightOnHover
            withColumnBorders
            verticalSpacing="sm"
            miw={600}
          >
            <thead>
              <tr>
                <th>Artist</th>
                <th>Start</th>
                <th>End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...stage.performances]
                .sort(
                  (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                )
                .map((performance) => (
                  <tr key={performance.id}>
                    <td>
                      <TextInput
                        defaultValue={performance.artist_name}
                        onChange={(e) =>
                          (performance.artist_name = e.currentTarget.value)
                        }
                        w="100%"
                        size="sm"
                      />
                    </td>
                    <td>
                      <TextInput
                        type="datetime-local"
                        defaultValue={performance.start_time?.slice(0, 16)}
                        onChange={(e) =>
                          (performance.start_time = e.currentTarget.value)
                        }
                        w="100%"
                        size="sm"
                      />
                    </td>
                    <td>
                      <TextInput
                        type="datetime-local"
                        defaultValue={performance.end_time?.slice(0, 16)}
                        onChange={(e) =>
                          (performance.end_time = e.currentTarget.value)
                        }
                        w="100%"
                        size="sm"
                      />
                    </td>
                    <td>
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          onClick={() => handleUpdatePerformance(performance)}
                        >
                          <IconDeviceFloppy size={18} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() =>
                            handleDeletePerformance(performance.id)
                          }
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                ))}
              <tr>
                <td colSpan={4}>
                  <Group wrap="wrap">
                    <TextInput
                      value={newPerformance}
                      onChange={(e) => setNewPerformance(e.currentTarget.value)}
                      placeholder="New performance"
                      w={{ base: "100%", sm: "auto" }}
                      flex={1}
                    />
                    <Button
                      leftSection={<IconPlus size={16} />}
                      onClick={handleAddPerformance}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Group>
                </td>
              </tr>
            </tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Card>
  );
}
