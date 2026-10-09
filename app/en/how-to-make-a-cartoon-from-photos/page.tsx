import GuidePage from "../../components/GuidePage";
import { guideMetadata } from "../../content/cartoon-guide";

export const metadata = guideMetadata("en");

export default function EnglishCartoonGuidePage() {
  return <GuidePage lang="en" />;
}
