import PhotoVideoLanding from "../../components/PhotoVideoLanding";
import { photoVideoMetadata } from "../../content/ai-video-from-photos";

export const metadata = photoVideoMetadata("ru");

export default function RussianPhotoVideoPage() {
  return <PhotoVideoLanding lang="ru" />;
}
