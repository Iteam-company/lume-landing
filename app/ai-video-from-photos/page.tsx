import PhotoVideoLanding from "../components/PhotoVideoLanding";
import { photoVideoMetadata } from "../content/ai-video-from-photos";

export const metadata = photoVideoMetadata("uk");

export default function PhotoVideoPage() {
  return <PhotoVideoLanding lang="uk" />;
}
