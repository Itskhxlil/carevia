import PageShell from "./PageShell.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import { useTranslation } from "react-i18next";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("appointments.title")}
      description={t("appointments.description")}
    >
      <EmptyPanel
        icon="event_available"
        title={t("appointments.empty")}
        detail={t("appointments.emptyDetail")}
      />
    </PageShell>
  );
}
