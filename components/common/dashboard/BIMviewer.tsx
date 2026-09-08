"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Download, Search, X, ChevronLeft, MessageCircle } from "lucide-react";

interface WorldConfig {
  backgroundColor?: string;
  directionalLightIntensity?: number;
  ambientLightIntensity?: number;
  modelUrl?: string;
}

interface ThatOpenWorldsProps {
  config?: WorldConfig;
  onWorldReady?: (world: OBC.World) => void;
  /** email -> display info, shown in the "Assigned to" dropdown */
  bcfUsers?: Record<string, { name: string; picture?: string }>;
  /** available BCF labels/disciplines */
  bcfLabels?: string[];
  /** used as the creationAuthor for new topics */
  currentUserEmail?: string;
}

const DEFAULT_CONFIG: WorldConfig = {
  backgroundColor: "#202932",
  directionalLightIntensity: 1.5,
  ambientLightIntensity: 1,
  modelUrl:
    "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
};



const DEFAULT_USERS: Record<string, { name: string }> = {
  "you@example.com": { name: "You" },
};

const DEFAULT_LABELS = ["Architecture", "Structure", "MEP"];

const STATUSES = ["Active", "In Progress", "Closed"] as const;
const PRIORITIES = ["Minor", "Normal", "Major"] as const;

type PsetMap = Record<string, Record<string, any>>;

interface SelectedElement {
  localId: number;
  name: string;
}

interface CapturedViewpoint {
  position: [number, number, number];
  target: [number, number, number];
}

interface TopicComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface TopicSummary {
  guid: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  labels: string[];
  assignedTo?: string;
  creationAuthor?: string;
  creationDate: Date;
  linkedElement?: SelectedElement;
  viewpoint?: CapturedViewpoint;
}

const statusColor: Record<string, string> = {
  Active: "bg-red-500/15 text-red-600 border-red-500/30",
  "In Progress": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
};

const priorityColor: Record<string, string> = {
  Minor: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  Normal: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  Major: "bg-rose-500/15 text-rose-600 border-rose-500/30",
};

export const ThatOpenWorlds: React.FC<ThatOpenWorldsProps> = ({
  config = DEFAULT_CONFIG,
  onWorldReady,
  bcfUsers = DEFAULT_USERS,
  bcfLabels = DEFAULT_LABELS,
  currentUserEmail = "you@example.com",
}) => {
  const pathname = usePathname();
  const isDashboard = pathname.endsWith('/dashboard');
  const containerRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<OBC.Components | null>(null);
  const worldRef = useRef<OBC.World | null>(null);
  const modelRef = useRef<FRAGS.FragmentsModel | null>(null);
  const bcfTopicsRef = useRef<OBC.BCFTopics | null>(null);

  // Lets external UI (topic detail panel) trigger the same highlight logic
  // that the canvas click handler uses.
  const highlightElementRef = useRef<((localId: number | null) => Promise<void>) | null>(
    null,
  );
  const currentSelectionRef = useRef<SelectedElement | null>(null);

  // --- Element inspection state (unchanged behavior) ---
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedPsets, setSelectedPsets] = useState<PsetMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(
    null,
  );

  // --- BCF Topics state ---
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [commentsByTopic, setCommentsByTopic] = useState<
    Record<string, TopicComment[]>
  >({});
  const [activeTopicGuid, setActiveTopicGuid] = useState<string | null>(null);
  const [selectedTopicGuids, setSelectedTopicGuids] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: STATUSES[0] as string,
    priority: PRIORITIES[1] as string,
    labels: new Set<string>(),
    assignedTo: "",
    linkElement: true,
  });




  const resetForm = () =>
    setForm({
      title: "",
      description: "",
      status: STATUSES[0],
      priority: PRIORITIES[1],
      labels: new Set<string>(),
      assignedTo: "",
      linkElement: true,
    });

  const syncTopics = () => {
    const bcfTopics = bcfTopicsRef.current;
    if (!bcfTopics) return;
    const list: TopicSummary[] = [...bcfTopics.list.values()].map((t: any) => ({
      guid: t.guid,
      title: t.title,
      description: t.description ?? "",
      status: t.status ?? "Active",
      priority: t.priority ?? "Normal",
      labels: t.labels ? [...t.labels] : [],
      assignedTo: t.assignedTo,
      creationAuthor: t.creationAuthor,
      creationDate: t.creationDate ?? new Date(),
      linkedElement: (t as any)._linkedElement,
      viewpoint: (t as any)._viewpoint,
    }));
    list.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
    setTopics(list);
  };

  useEffect(() => {
    let cancelled = false;
    let clickHandler: ((event: MouseEvent) => void) | null = null;
    let containerEl: HTMLDivElement | null = null;

    const initializeWorld = async () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      containerEl = container;

      const comps = new OBC.Components();
      componentsRef.current = comps;

      const worlds = comps.get(OBC.Worlds);
      const world = worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBC.SimpleRenderer
      >();

      world.scene = new OBC.SimpleScene(comps);
      world.renderer = new OBC.SimpleRenderer(comps, container);
      world.camera = new OBC.OrthoPerspectiveCamera(comps);

      comps.init();

      world.scene.setup();
      world.scene.three.background = null;

      world.scene.config.backgroundColor = new THREE.Color(
        config.backgroundColor,
      );
      world.scene.config.directionalLight.intensity =
        config.directionalLightIntensity ?? 1.5;
      world.scene.config.ambientLight.intensity =
        config.ambientLightIntensity ?? 1;

      await world.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);

      if (cancelled) {
        comps.dispose();
        return;
      }

      worldRef.current = world;
      onWorldReady?.(world);

      // --- BCF Topics setup ---
      const bcfTopics = comps.get(OBC.BCFTopics);
      bcfTopics.setup({
        users: new Set(Object.keys(bcfUsers)),
        labels: new Set(bcfLabels),
      });
      bcfTopicsRef.current = bcfTopics;
      bcfTopics.list.onItemSet.add(() => syncTopics());
      bcfTopics.list.onItemUpdated?.add(() => syncTopics());

      // --- Fragments setup ---
      const workerUrl = await OBC.FragmentsManager.getWorker();
      const fragments = comps.get(OBC.FragmentsManager);
      fragments.init(workerUrl);

      world.camera.controls.addEventListener("update", () =>
        fragments.core.update(),
      );

      world.onCameraChanged.add((camera) => {
        for (const [, m] of fragments.list) {
          m.useCamera(camera.three);
        }
        fragments.core.update(true);
      });

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);
        fragments.core.update(true);
      });

      fragments.core.models.materials.list.onItemSet.add(
        ({ value: material }) => {
          if (!("isLodMaterial" in material && material.isLodMaterial)) {
            material.polygonOffset = true;
            material.polygonOffsetUnits = 1;
            material.polygonOffsetFactor = Math.random();
          }
        },
      );

      // --- Load model ---
      let model: FRAGS.FragmentsModel | null = null;
      if (config.modelUrl) {
        try {
          const modelId = config.modelUrl
            .split("/")
            .pop()
            ?.split(".")
            .shift();
          if (modelId) {
            const file = await fetch(config.modelUrl);
            const buffer = await file.arrayBuffer();
            model = await fragments.core.load(buffer, { modelId });
            await world.camera.controls.setLookAt(
              68,
              23,
              -8.5,
              21.5,
              -5.5,
              23,
            );
            await fragments.core.update(true);
          }
        } catch (error) {
          console.error("Error loading model:", error);
        }
      }

      if (cancelled || !model) return;
      modelRef.current = model;

      // --- Selection / Highlighting ---
      const highlightMaterial: FRAGS.MaterialDefinition = {
        color: new THREE.Color("gold"),
        renderedFaces: FRAGS.RenderedFaces.TWO,
        opacity: 1,
        transparent: false,
      };

      let localId: number | null = null;

      const highlight = async () => {
        if (!localId || !model) return;
        await model.highlight([localId], highlightMaterial);
      };

      const resetHighlight = async () => {
        if (!localId || !model) return;
        await model.resetHighlight([localId]);
      };

      // Exposed so the Topics panel can re-highlight a linked element on demand.
      highlightElementRef.current = async (id: number | null) => {
        if (!model) return;
        if (localId) await model.resetHighlight([localId]);
        localId = id;
        if (localId) await model.highlight([localId], highlightMaterial);
        await fragments.core.update(true);
      };

      const formatItemPsets = (rawPsets: FRAGS.ItemData[]) => {
        const result: PsetMap = {};
        for (const [_, pset] of rawPsets.entries()) {
          const { Name: psetName, HasProperties } = pset as any;
          if (!("value" in psetName && Array.isArray(HasProperties))) continue;
          const props: Record<string, any> = {};
          for (const [__, prop] of HasProperties.entries()) {
            const { Name, NominalValue } = prop;
            if (!("value" in Name && "value" in NominalValue)) continue;
            const name = Name.value;
            const nominalValue = NominalValue.value;
            if (!(name && nominalValue !== undefined)) continue;
            props[name] = nominalValue;
          }
          result[psetName.value] = props;
        }
        return result;
      };

      const mouse = new THREE.Vector2();

      clickHandler = async (event: MouseEvent) => {
        if (!model) return;
        if (isDashboard) return;
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        const result = await model.raycast({
          camera: world.camera.three,
          mouse,
          dom: world.renderer!.three.domElement!,
        });

        if (result) {
          // New selection
          await resetHighlight();
          localId = result.localId;
          await highlight();

          if (!cancelled) setIsLoading(true);

          // Fetch Name
          let elementName = "Unknown";
          try {
            const [nameData] = await model.getItemsData([localId], {
              attributesDefault: false,
              attributes: ["Name"],
            });
            elementName =
              nameData &&
                "Name" in nameData &&
                "value" in (nameData as any).Name
                ? (nameData as any).Name.value
                : "Unknown";
            if (!cancelled) setSelectedName(elementName);
          } catch (e) {
            console.error("Error fetching name:", e);
            if (!cancelled) setSelectedName("Unknown");
          }

          if (!cancelled) {
            const sel = { localId: localId!, name: elementName };
            setSelectedElement(sel);
            currentSelectionRef.current = sel;
          }

          // Fetch Property Sets
          try {
            const [data] = await model.getItemsData([localId], {
              attributesDefault: false,
              attributes: ["Name", "NominalValue"],
              relations: {
                IsDefinedBy: { attributes: true, relations: true },
                DefinesOccurrence: { attributes: false, relations: false },
              },
            });
            const rawPsets = (data.IsDefinedBy as FRAGS.ItemData[]) ?? [];
            const formatted = formatItemPsets(rawPsets);
            if (!cancelled) setSelectedPsets(formatted);
          } catch (e) {
            console.error("Error fetching psets:", e);
            if (!cancelled) setSelectedPsets(null);
          }

          if (!cancelled) setIsLoading(false);
        } else {
          // Deselection
          await resetHighlight();
          localId = null;
          if (!cancelled) {
            setSelectedName(null);
            setSelectedPsets(null);
            setSelectedElement(null);
            currentSelectionRef.current = null;
            setIsLoading(false);
          }
        }

        await fragments.core.update(true);
      };

      container.addEventListener("click", clickHandler);
    };

    initializeWorld();

    return () => {
      cancelled = true;
      if (clickHandler && containerEl) {
        containerEl.removeEventListener("click", clickHandler);
      }
      componentsRef.current?.dispose();
      componentsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, onWorldReady]);

  // --- Camera helpers ---
  const captureViewpoint = (): CapturedViewpoint | undefined => {
    const world = worldRef.current;
    if (!world) return undefined;
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    world.camera.controls?.getPosition(pos);
    world.camera.controls?.getTarget(target);
    return {
      position: [pos.x, pos.y, pos.z],
      target: [target.x, target.y, target.z],
    };
  };

  const flyToViewpoint = async (vp?: CapturedViewpoint) => {
    const world = worldRef.current;
    if (!world || !vp) return;
    await world.camera.controls?.setLookAt(
      vp.position[0],
      vp.position[1],
      vp.position[2],
      vp.target[0],
      vp.target[1],
      vp.target[2],
      true,
    );
  };

  // --- Topic actions ---
  const handleCreateTopic = () => {
    const bcfTopics = bcfTopicsRef.current;
    if (!bcfTopics || !form.title.trim()) return;

    const linkedElement =
      form.linkElement && currentSelectionRef.current
        ? currentSelectionRef.current
        : undefined;

    const topic: any = bcfTopics.create({
      guid: THREE.MathUtils.generateUUID(),
      type: "Issue",
      status: form.status,
      title: form.title.trim(),
      priority: form.priority,
      labels: new Set(form.labels),
      creationDate: new Date(),
      creationAuthor: currentUserEmail,
      assignedTo: form.assignedTo || undefined,
      description: form.description.trim(),
    });

    // Attach a real BCF viewpoint reference (for export) plus our own
    // captured camera pose (used to fly back to it from the UI).
    const viewpointsComp = componentsRef.current?.get(OBC.Viewpoints);
    if (viewpointsComp && worldRef.current) {
      try {
        const viewpoint = viewpointsComp.create();
        viewpoint.world = worldRef.current;
        topic.viewpoints?.add?.(viewpoint.guid);
      } catch (e) {
        console.warn("Could not attach OBC viewpoint:", e);
      }
    }

    (topic as any)._viewpoint = captureViewpoint();
    (topic as any)._linkedElement = linkedElement;

    syncTopics();
    setShowTopicForm(false);
    resetForm();
    setActiveTopicGuid(topic.guid);
  };

  const updateTopicStatus = (guid: string, status: string) => {
    const bcfTopics = bcfTopicsRef.current;
    const topic: any = bcfTopics?.list.get(guid);
    if (!topic) return;
    topic.status = status;
    syncTopics();
  };

  const deleteTopic = (guid: string) => {
    const bcfTopics = bcfTopicsRef.current;
    try {
      bcfTopics?.list.delete?.(guid);
    } catch (e) {
      console.warn("Could not delete topic:", e);
    }
    setCommentsByTopic((prev) => {
      const next = { ...prev };
      delete next[guid];
      return next;
    });
    if (activeTopicGuid === guid) setActiveTopicGuid(null);
    syncTopics();
  };

  const addComment = (guid: string) => {
    if (!newComment.trim()) return;
    setCommentsByTopic((prev) => ({
      ...prev,
      [guid]: [
        ...(prev[guid] ?? []),
        {
          id: THREE.MathUtils.generateUUID(),
          author: currentUserEmail,
          text: newComment.trim(),
          date: new Date().toISOString(),
        },
      ],
    }));
    setNewComment("");
  };

  const goToTopic = async (topic: TopicSummary) => {
    setActiveTopicGuid(topic.guid);
    if (topic.linkedElement) {
      await highlightElementRef.current?.(topic.linkedElement.localId);
    }
    await flyToViewpoint(topic.viewpoint);
  };

  const toggleTopicSelection = (guid: string) => {
    setSelectedTopicGuids((prev) => {
      const next = new Set(prev);
      if (next.has(guid)) next.delete(guid);
      else next.add(guid);
      return next;
    });
  };

  const exportBcf = async (onlySelected: boolean) => {
    const bcfTopics = bcfTopicsRef.current;
    if (!bcfTopics) return;

    const guids = onlySelected
      ? [...selectedTopicGuids]
      : topics.map((t) => t.guid);
    const topicObjs = guids
      .map((g) => bcfTopics.list.get(g))
      .filter(Boolean) as any[];

    if (topicObjs.length === 0) return;

    const bcfData = await bcfTopics.export(topicObjs);
    const bcfFile = new File([bcfData], "topics.bcf");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(bcfFile);
    a.download = bcfFile.name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.labels.some((l) => l.toLowerCase().includes(q)),
    );
  }, [topics, searchQuery]);

  const activeTopic = topics.find((t) => t.guid === activeTopicGuid) ?? null;
  const activeComments = activeTopicGuid
    ? commentsByTopic[activeTopicGuid] ?? []
    : [];



  return (

    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "2%",
        }}
      />

      {/* Selected Element Card */}
      {/* Selected Element Card */}
      {!isDashboard && selectedElement && (
        <Card className="absolute top-4 right-4 z-50 max-w-[50vh] max-h-[50vh] overflow-auto flex flex-col shadow-xl border-border/50 bg-background">
          <CardHeader className="shrink-0 pb-3">
            <div className="flex flex-col items-start justify-between gap-2">
              <div>
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Selected Element
                </CardTitle>

                <CardDescription className="text-base font-medium text-foreground overflow-auto pt-1">
                  {isLoading && !selectedName ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    selectedName ?? ""
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Property Sets */}
          {selectedPsets && Object.keys(selectedPsets).length > 0 && (
            <CardContent className="pt-0">
              <ScrollArea className="h-full pr-3">
                <div className="space-y-4">
                  {Object.entries(selectedPsets).map(([psetName, props]) => (
                    <div key={psetName} className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        {psetName}
                      </Badge>

                      <div className="grid gap-1.5">
                        {Object.entries(props).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-start gap-4 text-sm border-b border-border/40 pb-1 last:border-0 last:pb-0"
                          >
                            <span className="text-muted-foreground text-xs shrink-0">
                              {key}
                            </span>

                            <span className="font-mono text-xs text-foreground text-right break-all">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          )}

          {/* No Property Sets */}
          {selectedPsets &&
            Object.keys(selectedPsets).length === 0 && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground italic">
                  No property sets found for this element.
                </p>
              </CardContent>
            )}

          {/* Add BCF Comment */}
          <Dialog open={showTopicForm} onOpenChange={setShowTopicForm}>
            <DialogTrigger asChild>
              <Button
                className="relative w-auto p-3 mx-3 flex align-middle"
                size="icon"
                variant="secondary"
                title="Create BCF topic"
              >
                <span>Add a comment</span>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <TopicFormDialog
              form={form}
              setForm={setForm}
              bcfUsers={bcfUsers}
              bcfLabels={bcfLabels}
              linkedElementName={selectedElement?.name}
              onSubmit={handleCreateTopic}
              onCancel={() => setShowTopicForm(false)}
            />
          </Dialog>
        </Card>
      )}

      {/* BCF Topics Panel */}

      {!isDashboard && (



        <Card className="absolute  top-2 left-2 z-50 w-96  flex flex-col shadow-xl border-border/50 bg-background">
          <CardHeader className="shrink-0 pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs font-semibold  text-muted-foreground">
                Discussions ({topics.length})
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Export selected (or all) as .bcf"
                  onClick={() => exportBcf(selectedTopicGuids.size > 0)}
                >
                  <Download className="h-4 w-4" />
                </Button>

              </div>
            </div>
            <div className="relative pt-2">
              <Search className="absolute left-2 top-4.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="pl-7 h-8 text-sm"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0 overflow-auto flex-1 flex flex-col">
            {activeTopic ? (
              <TopicDetail
                topic={activeTopic}
                comments={activeComments}
                newComment={newComment}
                setNewComment={setNewComment}
                onBack={() => setActiveTopicGuid(null)}
                onGoTo={() => goToTopic(activeTopic)}
                onStatusChange={(s) => updateTopicStatus(activeTopic.guid, s)}
                onDelete={() => deleteTopic(activeTopic.guid)}
                onAddComment={() => addComment(activeTopic.guid)}
              />
            ) : (
              <ScrollArea className="h-full pr-3">
                <div className="space-y-2">
                  {filteredTopics.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">
                      No topics yet. Select an element and hit the + button to
                      create one.
                    </p>
                  )}
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.guid}
                      className="flex items-start gap-2 rounded-md border border-border/40 p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedTopicGuids.has(topic.guid)}
                        onCheckedChange={() => toggleTopicSelection(topic.guid)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => goToTopic(topic)}
                      >
                        <p className="text-sm font-medium truncate">
                          {topic.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${statusColor[topic.status] ?? ""}`}
                          >
                            {topic.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${priorityColor[topic.priority] ?? ""}`}
                          >
                            {topic.priority}
                          </Badge>
                          {topic.linkedElement && (
                            <Badge variant="secondary" className="text-[10px]">
                              {topic.linkedElement.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

      )}
    </div>
  );
};

// --- Topic creation dialog ---

interface TopicFormState {
  title: string;
  description: string;
  status: string;
  priority: string;
  labels: Set<string>;
  assignedTo: string;
  linkElement: boolean;
}

const TopicFormDialog: React.FC<{
  form: TopicFormState;
  setForm: React.Dispatch<React.SetStateAction<TopicFormState>>;
  bcfUsers: Record<string, { name: string; picture?: string }>;
  bcfLabels: string[];
  linkedElementName?: string;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({
  form,
  setForm,
  bcfUsers,
  bcfLabels,
  linkedElementName,
  onSubmit,
  onCancel,
}) => {
    const toggleLabel = (label: string) => {
      setForm((prev) => {
        const labels = new Set(prev.labels);
        if (labels.has(label)) labels.delete(label);
        else labels.add(label);
        return { ...prev, labels };
      });
    };

    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Discussion</DialogTitle>
          <DialogDescription>
            Create an issue tied to the current view
            {linkedElementName ? ` and the selected element (${linkedElementName})` : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="topic-title">Title</Label>
            <Input
              id="topic-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder=""
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="topic-description">Description</Label>
            <Textarea
              id="topic-description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder=""
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Assigned to</Label>
            <Select
              value={form.assignedTo}
              onValueChange={(v) => setForm((f) => ({ ...f, assignedTo: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(bcfUsers).map(([email, u]) => (
                  <SelectItem key={email} value={email}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-3">
              {bcfLabels.map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={form.labels.has(label)}
                    onCheckedChange={() => toggleLabel(label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {linkedElementName && (
            <label className="flex items-center gap-2 text-sm cursor-pointer pt-1">
              <Checkbox
                checked={form.linkElement}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, linkElement: Boolean(v) }))
                }
              />
              Link to selected element ({linkedElementName})
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!form.title.trim()}>
            Create Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

// --- Topic detail panel ---

const TopicDetail: React.FC<{
  topic: TopicSummary;
  comments: TopicComment[];
  newComment: string;
  setNewComment: (v: string) => void;
  onBack: () => void;
  onGoTo: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  onAddComment: () => void;
}> = ({
  topic,
  comments,
  newComment,
  setNewComment,
  onBack,
  onGoTo,
  onStatusChange,
  onDelete,
  onAddComment,
}) => {
const pathname = usePathname();
const isDashboard = pathname.endsWith('/dashboard');

    return (
      <>
        {!isDashboard && (
          <ScrollArea className="h-full overflow-auto pr-3">
            <div className="space-y-3 ">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={onBack} className="px-1">

                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button variant="outline" size="sm" onClick={onGoTo}>
                  Go to view
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold">{topic.title}</h3>
                {topic.description && (
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${priorityColor[topic.priority] ?? ""}`}
                >
                  {topic.priority}
                </Badge>
                {topic.labels.map((l) => (
                  <Badge key={l} variant="secondary" className="text-[10px]">
                    {l}
                  </Badge>
                ))}
                {topic.linkedElement && (
                  <Badge variant="secondary" className="text-[10px]">
                    📍 {topic.linkedElement.name}
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={topic.status} onValueChange={onStatusChange}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {topic.assignedTo && (
                <p className="text-xs text-muted-foreground">
                  Assigned to <span className="font-medium">{topic.assignedTo}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Created {new Date(topic.creationDate).toLocaleString()}
                {topic.creationAuthor ? ` by ${topic.creationAuthor}` : ""}
              </p>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs">Comments</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {comments.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      No comments yet.
                    </p>
                  )}
                  {comments.map((c) => (
                    <div key={c.id} className="text-xs border-b border-border/30 pb-1.5">
                      <div className="flex justify-between text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {c.author}
                        </span>
                        <span>{new Date(c.date).toLocaleString()}</span>
                      </div>
                      <p className="mt-0.5">{c.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onAddComment();
                    }}
                  />
                  <Button size="sm" onClick={onAddComment}>
                    Add
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={onDelete}
              >
                Delete Topic
              </Button>
            </div>
          </ScrollArea>
        )}
      </>
    );
  };

export default ThatOpenWorlds;