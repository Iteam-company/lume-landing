import PhotoVideoLanding from "../../components/PhotoVideoLanding";
import { photoVideoMetadata } from "../../content/ai-video-from-photos";

export const metadata = photoVideoMetadata("en");

export default function EnglishPhotoVideoPage() {
  return <PhotoVideoLanding lang="en" />;
}
