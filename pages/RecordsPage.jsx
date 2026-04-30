import PageShell from "./PageShell.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import { useTranslation } from "react-i18next";

export default function RecordsPage() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("nav.records")}
      description={t("records.recordsDescription")}
    >
      <EmptyPanel
        icon="description"
        title={t("records.noRecordsOnFile")}
        detail={t("records.noRecordsDesc")}
      />
    </PageShell>
  );
}
