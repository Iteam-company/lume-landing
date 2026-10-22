import GuidePage from "../../components/GuidePage";
import { guideMetadata } from "../../content/cartoon-guide";

export const metadata = guideMetadata("ru");

export default function RussianCartoonGuidePage() {
  return <GuidePage lang="ru" />;
}
