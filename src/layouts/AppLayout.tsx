import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DemoPanel } from "@/components/demo/DemoPanel";
import { MeetingAgent } from "@/components/meeting/MeetingAgent";
import { useTranslation } from "@/utils/i18n";

const titleMap: { match: RegExp; key: string }[] = [
  { match: /^\/dashboard/, key: "pageTitle.dashboard" },
  { match: /^\/students\/[^/]+$/, key: "pageTitle.studentProfile" },
  { match: /^\/students/, key: "pageTitle.students" },
  { match: /^\/questions\/review/, key: "pageTitle.questionReview" },
  { match: /^\/questions\/create/, key: "pageTitle.createQuestion" },
  { match: /^\/questions\/upload/, key: "pageTitle.uploadQuestions" },
  { match: /^\/questions/, key: "pageTitle.questions" },
  { match: /^\/assignments/, key: "pageTitle.assignments" },
  { match: /^\/study-rooms\/[^/]+\/topics\/[^/]+$/, key: "pageTitle.topicDiscussion" },
  { match: /^\/study-rooms\/[^/]+$/, key: "pageTitle.studyRoom" },
  { match: /^\/study-rooms/, key: "pageTitle.studyRooms" },
  { match: /^\/materials/, key: "pageTitle.studyMaterials" },
  { match: /^\/notifications/, key: "pageTitle.notifications" },
  { match: /^\/admin-requests/, key: "pageTitle.adminRequests" },
  { match: /^\/account/, key: "pageTitle.b2bAccount" },
  { match: /^\/settings/, key: "pageTitle.settings" },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const titleKey = titleMap.find((item) => item.match.test(location.pathname))?.key ?? "pageTitle.fallback";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={t(titleKey)} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <DemoPanel />
      <MeetingAgent />
    </div>
  );
}
