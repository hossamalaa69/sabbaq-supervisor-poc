import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Onboarding from "@/pages/auth/Onboarding";
import B2BStatusPage from "@/pages/auth/B2BStatus";

import Dashboard from "@/pages/Dashboard";
import StudentsList from "@/pages/students/StudentsList";
import StudentDetail from "@/pages/students/StudentDetail";
import QuestionsPage from "@/pages/questions/QuestionsPage";
import QuestionReviewPage from "@/pages/questions/QuestionReviewPage";
import CreateQuestionPage from "@/pages/questions/CreateQuestionPage";
import UploadQuestionsPage from "@/pages/questions/UploadQuestionsPage";
import StudyRoomsList from "@/pages/studyrooms/StudyRoomsList";
import StudyRoomDetail from "@/pages/studyrooms/StudyRoomDetail";
import TopicDiscussion from "@/pages/studyrooms/TopicDiscussion";
import MaterialsPage from "@/pages/MaterialsPage";
import AccountPage from "@/pages/AccountPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AdminRequestsPage from "@/pages/AdminRequestsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import AssignmentsPage from "@/pages/AssignmentsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/b2b-status" element={<B2BStatusPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentsList />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/questions/review" element={<QuestionReviewPage />} />
        <Route path="/questions/create" element={<CreateQuestionPage />} />
        <Route path="/questions/upload" element={<UploadQuestionsPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/study-rooms" element={<StudyRoomsList />} />
        <Route path="/study-rooms/:id" element={<StudyRoomDetail />} />
        <Route path="/study-rooms/:id/topics/:topicId" element={<TopicDiscussion />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin-requests" element={<AdminRequestsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
