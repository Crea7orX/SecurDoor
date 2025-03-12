import { Card, CardFooter } from "@/components/ui/card";
import { demo } from "@/config/demo";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function DemoPage() {
  const t = useTranslations("Dashboard.demo");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <Card className="bg-border p-4">
        <iframe
          src={`https://www.youtube.com/embed/${demo.videoId}`}
          width="1280"
          height="720"
          allowFullScreen={true}
        />
        <CardFooter className="items-center justify-center p-0 pt-4">
          <p>
            {t.rich("not_playing", {
              link: (chunks) => (
                <Link
                  href={`https://www.youtube.com/watch?v=${demo.videoId}`}
                  target="_blank"
                  className="underline hover:text-info"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
