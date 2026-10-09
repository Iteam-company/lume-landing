import GuidePage from "../components/GuidePage";
import { guideMetadata } from "../content/cartoon-guide";

export const metadata = guideMetadata("uk");

export default function CartoonGuidePage() {
  return <GuidePage lang="uk" />;
}
