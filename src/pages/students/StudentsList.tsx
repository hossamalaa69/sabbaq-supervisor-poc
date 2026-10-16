import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MoreHorizontal, Users2, Plus, UserCheck, UserX, Clock3, Link2, TicketCheck, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Select, Checkbox } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Tabs } from "@/components/ui/Tabs";
import { useStudentsStore, useClassesStore } from "@/store";
import { EXAM_TYPES, type ExamType, type StudentGroup } from "@/types";
import { formatDate } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import { localizeClassContent } from "@/utils/contentTranslations";
import { toast } from "sonner";

const groupOptions: StudentGroup[] = ["Advanced", "Intermediate", "Needs Support"];

export default function StudentsList() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    students,
    pendingJoinRequests = [],
    assignGroup,
    acceptJoinRequest,
    rejectJoinRequest,
    resetJoinRequests,
  } = useStudentsStore();
  const classes = useClassesStore((s) => s.classes);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [examFilter, setExamFilter] = useState<"all" | ExamType>("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState<StudentGroup>("Advanced");
  const [view, setView] = useState<"students" | "requests">("students");

  const categoryParam = searchParams.get("category");
  const idsParam = searchParams.get("ids");

  useEffect(() => {
    if (categoryParam === "improving") setPerformanceFilter("improving");
    if (categoryParam === "struggling") setPerformanceFilter("struggling");
    if (categoryParam === "inactive") setStatusFilter("inactive");
  }, [categoryParam]);

  const idsFilter = idsParam ? idsParam.split(",") : null;

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (idsFilter && !idsFilter.includes(s.id)) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (classFilter !== "all" && s.classId !== classFilter) return false;
      if (examFilter !== "all" && s.examType !== examFilter) return false;
      if (groupFilter !== "all" && s.group !== groupFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (performanceFilter === "improving" && s.improvementPct <= 3) return false;
      if (performanceFilter === "struggling" && !(s.improvementPct <= 3 && s.averageScore < 65)) return false;
      if (performanceFilter === "top" && s.averageScore < 85) return false;
      return true;
    });
  }, [students, search, classFilter, examFilter, groupFilter, statusFilter, performanceFilter, idsFilter]);

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleAssign() {
    assignGroup(selected, targetGroup);
    toast.success(t("students.toastMoved", { count: selected.length, group: t(`enums.group.${targetGroup}`) }));
    setSelected([]);
    setGroupModalOpen(false);
  }

  const studentTabs = [
    {
      value: "students",
      label: t("students.tabs.enrolled"),
      icon: <Users2 className="h-4 w-4" />,
      count: students.length,
    },
    {
      value: "requests",
      label: t("students.tabs.joinRequests"),
      icon: <UserCheck className="h-4 w-4" />,
      count: pendingJoinRequests.length,
    },
  ];

  if (view === "requests") {
    return (
      <div className="space-y-4">
        <Tabs
          tabs={studentTabs}
          value={view}
          onChange={(value) => setView(value as "students" | "requests")}
          className="w-fit max-w-full"
        />

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <div>
              <p className="font-semibold">{t("students.requests.pendingCount", { count: pendingJoinRequests.length })}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("students.requests.subtitle")}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                resetJoinRequests();
                toast.success(t("students.requests.toastReset"));
              }}
            >
              <RotateCcw className="h-4 w-4" />
              {t("students.requests.reset")}
            </Button>
          </CardContent>
        </Card>

        {pendingJoinRequests.length === 0 ? (
          <EmptyState
            icon={<UserCheck className="h-8 w-8" />}
            title={t("students.requests.emptyTitle")}
            description={t("students.requests.emptyDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingJoinRequests.map((request) => {
              const requestedClass = classes.find((item) => item.id === request.classId);
              const displayClass = requestedClass
                ? localizeClassContent(requestedClass, lang)
                : null;

              return (
                <Card key={request.id}>
                  <CardContent className="space-y-4 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={request.name} size="md" />
                        <div className="min-w-0">
                          <p className="truncate font-bold">{request.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-sm text-muted-foreground">{request.phone}</p>
                        </div>
                      </div>
                      <ExamTypeBadge examType={request.examType} />
                    </div>

                    <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{t("students.requests.requestedFor")}</span>
                        <span className="font-semibold">{displayClass?.name ?? t("common.dash")}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock3 className="h-4 w-4" /> {t("students.requests.requestedAt")}
                        </span>
                        <span className="font-medium">{formatDate(request.requestedAt, lang)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {request.source === "code"
                            ? t("students.requests.sourceCode")
                            : t("students.requests.sourceLink")}
                        </span>
                        {request.source === "code" ? (
                          <TicketCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Link2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-1.5"
                        onClick={() => {
                          acceptJoinRequest(request.id);
                          toast.success(t("students.requests.toastAccepted", { name: request.name }));
                        }}
                      >
                        <UserCheck className="h-4 w-4" /> {t("students.requests.accept")}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-1.5 text-destructive"
                        onClick={() => {
                          rejectJoinRequest(request.id);
                          toast.success(t("students.requests.toastRejected", { name: request.name }));
                        }}
                      >
                        <UserX className="h-4 w-4" /> {t("students.requests.reject")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={studentTabs}
        value={view}
        onChange={(value) => setView(value as "students" | "requests")}
        className="w-fit max-w-full"
      />
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-5">
          <div className="min-w-[200px] flex-1">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder={t("students.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select className="w-auto min-w-[140px]" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">{t("filters.allClasses")}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {localizeClassContent(c, lang).name}
              </option>
            ))}
          </Select>
          <Select className="w-auto min-w-[140px]" value={examFilter} onChange={(e) => setExamFilter(e.target.value as "all" | ExamType)}>
            <option value="all">{t("filters.allExamTypes")}</option>
            {EXAM_TYPES.map((et) => (
              <option key={et} value={et}>
                {t(`enums.examType.${et}`)}
              </option>
            ))}
          </Select>
          <Select className="w-auto min-w-[140px]" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="all">{t("filters.allGroups")}</option>
            {groupOptions.map((g) => (
              <option key={g} value={g}>
                {t(`enums.group.${g}`)}
              </option>
            ))}
          </Select>
          <Select className="w-auto min-w-[140px]" value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)}>
            <option value="all">{t("filters.allPerformance")}</option>
            <option value="top">{t("filters.topPerformers")}</option>
            <option value="improving">{t("filters.improving")}</option>
            <option value="struggling">{t("filters.struggling")}</option>
          </Select>
          <Select className="w-auto min-w-[140px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">{t("filters.allActivity")}</option>
            <option value="active">{t("filters.active")}</option>
            <option value="inactive">{t("filters.inactive")}</option>
          </Select>
        </CardContent>
      </Card>

      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          <p className="text-sm font-semibold">{t("students.selectedCount", { count: selected.length })}</p>
          <Button size="sm" className="gap-1.5" onClick={() => setGroupModalOpen(true)}>
            <Users2 className="h-4 w-4" /> {t("students.moveToGroup")}
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users2 className="h-8 w-8" />}
          title={t("students.noMatch.title")}
          description={t("students.noMatch.desc")}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={() =>
                    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id))
                  }
                />
              </TableHead>
              <TableHead>{t("students.table.student")}</TableHead>
              <TableHead>{t("students.table.class")}</TableHead>
              <TableHead>{t("students.table.examType")}</TableHead>
              <TableHead>{t("students.table.group")}</TableHead>
              <TableHead>{t("students.table.avgScore")}</TableHead>
              <TableHead>{t("students.table.improvement")}</TableHead>
              <TableHead>{t("students.table.lastActivity")}</TableHead>
              <TableHead>{t("students.table.status")}</TableHead>
              <TableHead className="w-10">{t("students.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const cls = classes.find((c) => c.id === s.classId);
              const displayClass = cls ? localizeClassContent(cls, lang) : null;
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex items-center gap-2.5 text-start"
                      onClick={() => navigate(`/students/${s.id}`)}
                    >
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <span className="font-semibold">{s.name}</span>
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{displayClass?.name ?? t("common.dash")}</TableCell>
                  <TableCell>
                    <ExamTypeBadge examType={s.examType} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t(`enums.group.${s.group}`)}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{s.averageScore}%</TableCell>
                  <TableCell>
                    <span className={s.improvementPct >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                      {s.improvementPct >= 0 ? "+" : ""}
                      {s.improvementPct}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(s.lastActivity, lang)}</TableCell>
                  <TableCell>
                    {s.accessStatus === "deactivated" ? (
                      <Badge variant="destructive">{t("students.accessDeactivated")}</Badge>
                    ) : (
                      <Badge variant={s.status === "active" ? "success" : "outline"}>
                        {t(`enums.studentStatus.${s.status}`)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/students/${s.id}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={groupModalOpen} onClose={() => setGroupModalOpen(false)}>
        <DialogHeader
          title={t("students.moveDialog.title")}
          description={t("students.moveDialog.desc", { count: selected.length })}
          onClose={() => setGroupModalOpen(false)}
        />
        <div className="space-y-3">
          {groupOptions.map((g) => (
            <label
              key={g}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="group"
                checked={targetGroup === g}
                onChange={() => setTargetGroup(g)}
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm font-semibold">{t(`enums.group.${g}`)}</span>
            </label>
          ))}
          <Button className="w-full gap-1.5" onClick={handleAssign}>
            <Plus className="h-4 w-4" /> {t("students.moveDialog.assignTo", { group: t(`enums.group.${targetGroup}`) })}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
